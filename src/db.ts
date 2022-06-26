import deepEqual from 'deep-equal';
import { Collection, Document, Filter, MongoClient, MongoServerError, ObjectId, WithId } from "mongodb";
import ProgressBar from 'progress';
import { getAllVersions } from "./git.js";
import { getSchemaObject, Schema } from "./schema.js";
import { getVersion } from "./version.js";

import TextMap from './schema/TextMap.js';
import NPC from './schema/NPC.js';
import Quest from './schema/Quest.js';
import MainQuest from './schema/MainQuest.js';
import Dialog from './schema/Dialog.js';
import Talk from './schema/Talk.js';

const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri, { keepAlive: true });
const cachedVersionId: Record<string, ObjectId> = {};
let db = client.db("wt");

export async function initDatabase() {
    const integrity = await checkIntegrity();
    if (integrity !== 'ok') {
        console.log("[db] regenerating database");
        if (integrity === 'textmap' || integrity === 'version') {
            await db.dropDatabase();
            db = client.db("wt");
            await addVersionReference();
            await addTextMaps();
        }

        if (integrity === 'schema') {
            for (const cs of [["Schema"], ...collections]) {
                try {
                    await db.collection(cs[0]).drop();
                } catch (e) {
                    if ((e as MongoServerError).codeName !== 'NamespaceNotFound') {
                        throw e;
                    }
                }
            }
        }

        await addCollections();
    }
    
    db.collection("Version").find({}).forEach(e => { cachedVersionId[e.hash] = e._id });
}

async function addVersionReference() {
    const coll = await db.createCollection("Version");
    const docs = [];
    for (const v of await getAllVersions()) {
        const shortver = /\d+\.\d+\.\d+/.exec(v.message)?.slice(-1)?.[0] ?? '???';
        const obj: any = {
            hash: v.hash,
            fullVersion: v.message,
            ver: shortver,
        };
        obj["objectId"] = (await coll.insertOne(obj)).insertedId;
        docs.push(obj);
    }
    return docs;
}

const collections: [string, Schema][] = [
    ["NPC", NPC],
    ["Quest", Quest],
    ["MainQuest", MainQuest],
    ["Dialog", Dialog],
    ["Talk", Talk]
];

async function addCollections() {
    const schema = await db.createCollection("Schema");
    for (const cs of collections) {
        const coll = await db.createCollection(cs[0]);
        await foreachVersion(async ver => {
            try {
                const obj = await getSchemaObject(cs[1], ver.ver, ver.hash);
                await insertMany(coll, obj, e => (e.map(v => ({ _ver: ver._id, ...v }))), `${cs[0]} ${ver.ver}`);
            } catch (e) {
                console.log("[db] addCollection:", "failed to generate", cs[0], "for", ver);
                throw e;
            }
        })
        schema.insertOne({
            name: cs[0], schema: cs[1]
        });
    }
}

async function addTextMaps() {
    const textColl = await db.createCollection("TextMap");
    await foreachVersion(async ver => {
        const cnLang = await getSchemaObject(TextMap, ver.ver, ver.hash, { lang: 'CHS'});
        const enLang = await getSchemaObject(TextMap, ver.ver, ver.hash, { lang: 'EN' });
        const jpLang = await getSchemaObject(TextMap, ver.ver, ver.hash, { lang: 'JP' });
        await insertMany(textColl, Object.keys(cnLang), v =>
            v.map(k => ({
                _ver: ver._id,
                hash: parseInt(k),
                cn: cnLang[k],
                en: enLang[k],
                jp: jpLang[k]
            })).filter(w => w.cn !== '' || w.en !== '' || w.jp !== '')
            , `TextMap ${ver.ver}`);
        console.log(`[db] created ${ver.ver} TextMap`);
    });
}

async function foreachVersion(cb: (doc: Document) => void) {
    const versions = db.collection("Version").find();
    const fw: WithId<Document>[] = [];
    await versions.forEach(o => { fw.push(o); });
    for (const o of fw) {
        await cb(o);
    }
}

async function insertMany(coll: Collection<Document>, src: any[], mapper: (v: typeof src) => any[], progressName: string) {
    let len = src.length;
    let sz = 100000;
    const progress = new ProgressBar(`${progressName} [:bar] :current/:total`, { total: len });
    for (let i = 0; i < Math.ceil(len / sz); i++) {
        let partData = mapper(src.slice(i * sz, (i + 1) * sz));
        await coll.insertMany(partData);
        progress.tick(sz);
    }
    progress.terminate();
}

export function getVersionOid(sha: string) {
    return cachedVersionId[sha];
}

export function currentOid() {
    return getVersionOid(getVersion()!);
}

export async function find(collection: string, query: any) {
    return findIter(collection, query).toArray();
}

export function findIter(collection: string, query: any) {
    return db.collection(collection).find(query);
}

export async function findOne(collection: string, query: Filter<Document>) {
    return db.collection(collection).findOne(query);
}

export function collection (name: string) {
    return db.collection(name);
}

async function checkIntegrity() {
    const hashes = (await getAllVersions()).map(ver => ver.hash);
    const cnt = await db.collection("Version").find({}).toArray();
    if (cnt.length !== hashes.length) {
        console.log("[db] integrity: version size mismatch");
        return "version";
    }

    const textVers = await db.collection("TextMap").aggregate([{
        $group: { _id: "$_ver" }
    }]).map(e => e._id).toArray();
    if (textVers.length !== hashes.length) {
        console.log("[db] integrity: textmap size mismatch");
        return "textmap";
    }

    const schemaColl = db.collection("Schema");
    for (const [name, schema] of collections) {
        const col = await schemaColl.findOne({ name });
        if (col === null) {
            console.log("[db] integrity: missing schema", name);
            return "schema";
        }
        if (!deepEqual(col["schema"], schema)) {
            console.log("[db] integrity: schema", name, "is outdated");
            return "schema";
        }
    }
    return "ok";
}
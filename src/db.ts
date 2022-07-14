import deepEqual from 'fast-deep-equal';
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

const dataVersion = 3;
export async function initDatabase() {
    const integrity = await checkIntegrity();
    if (integrity !== 'ok') {
        console.log("[db] regenerating database");
        console.time("regenerate");
        if (integrity === 'version') {
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
        await db.collection("Schema").insertOne({ name: '_wtDataVer', v: dataVersion });
        console.timeEnd("regenerate");
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

const collections: [string, Schema, any?][] = [
    ["NPC", NPC, { Id: 1 }],
    ["Quest", Quest],
    ["MainQuest", MainQuest],
    ["Dialog", Dialog, { Id: 1 }],
    ["Talk", Talk, { Id: 1 }]
];

async function addCollections() {
    const schema = await db.createCollection("Schema");
    for (const cs of collections) {
        const coll = await db.createCollection(cs[0]);

        let currentObject: Record<string, any> = {};
        let first = true;
        await foreachVersion(async ver => {
            try {
                const obj = await getSchemaObject(cs[1], ver.ver, ver.hash);
                if (first) {
                    console.log(`[db] add reference ${cs[0]} ${ver.ver}`);
                    await insertMany(coll, obj, e => (e.map(v => ({ _ver: ver._id, ...v }))), `${cs[0]} ${ver.ver}`);
                    obj.forEach((v: { Id: string | number; }) => { currentObject[v.Id] = v });
                    first = false;
                    return;
                }

                const progress = new ProgressBar(`${cs[0]} ${ver.ver} [:bar] :current/:total d=:dirty`, { total: obj.length });
                let dirty = 0;
                for(const v of obj) {
                    const id = v.Id;
                    if (!deepEqual(currentObject[id], v)) {
                        currentObject[id] = v;
                        await coll.insertOne({
                            _ver: ver._id,
                            ...v
                        });
                        dirty++;
                    }
                    progress.tick({ dirty });
                }


                progress.terminate();
            } catch (e) {
                console.log("[db] addCollection:", "failed to generate", cs[0], "for", ver);
                throw e;
            }
        })

        if (cs[2]) {
            let id = Array.isArray(cs[2])? cs[2] : [cs[2]];
            await coll.createIndexes(id.map(i => ({ key: i })));
        }

        await schema.insertOne({
            name: cs[0], schema: cs[1], index: cs[2]
        });

    }
}

async function addTextMaps() {
    const textColl = await db.createCollection("TextMap");
    let [currentCn, currentEn, currentJp]: Record<string, string>[] = [{}, {}, {}];

    let first = true;
    await foreachVersion(async ver => {
        const cnLang = await getSchemaObject(TextMap, ver.ver, ver.hash, { lang: 'CHS'});
        const enLang = await getSchemaObject(TextMap, ver.ver, ver.hash, { lang: 'EN' });
        const jpLang = await getSchemaObject(TextMap, ver.ver, ver.hash, { lang: 'JP' });

        if (first) {
            console.log(`[db] add reference TextMap ${ver.ver}`);
            await insertMany(textColl, Object.keys(cnLang), v =>
            v.map(k => ({
                _ver: ver._id,
                hash: parseInt(k),
                cn: cnLang[k],
                en: enLang[k],
                jp: jpLang[k]
            })).filter(w => w.cn !== '' || w.en !== '' || w.jp !== ''), `TextMap ${ver.ver}`);

            [currentCn, currentEn, currentJp] = [cnLang, enLang, jpLang];
            first = false;
            return;
        }

        const progress = new ProgressBar(`TextMap ${ver.ver} [:bar] :current/:total d=:dirty`, { total: Object.keys(cnLang).length });
        let dirty = 0;
        for (const k of Object.keys(cnLang)) {
            const object = {
                _ver: ver._id,
                hash: parseInt(k),
                cn: cnLang[k],
                en: enLang[k],
                jp: jpLang[k],
            };

            // exclude empty strings
            if (cnLang[k] === '') {
                progress.total--;
                continue;
            }

            const isDirty = 
                currentCn[k] === undefined || 
                currentCn[k] !== cnLang[k] ||
                currentEn[k] !== enLang[k] ||
                currentJp[k] !== jpLang[k];
            
            if (isDirty) {
                [currentCn[k], currentEn[k], currentJp[k]] = [cnLang[k], enLang[k], jpLang[k]];
                await textColl.insertOne(object);
                dirty++;
            }
            progress.tick({ dirty });
        }

        progress.terminate();
        console.log(`[db] created ${ver.ver} TextMap`);
    });

    console.log("[db] create index for TextMap")
    await textColl.createIndex({ hash: 1 })
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
    let sz = 10000;
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

    const schemaColl = db.collection("Schema");
    if ((await schemaColl.findOne({ name: "_wtDataVer" }))?.v !== dataVersion) {
        console.log("[db] data version mismatch");
        return "version";
    }

    for (const [name, schema, index] of collections) {
        const col = await schemaColl.findOne({ name });
        if (col === null) {
            console.log("[db] integrity: missing schema", name);
            return "schema";
        }
        if (!deepEqual(col["schema"], schema) && !deepEqual(col["index"], index)) {
            console.log("[db] integrity: schema", name, "is outdated");
            return "schema";
        }
    }
    return "ok";
}
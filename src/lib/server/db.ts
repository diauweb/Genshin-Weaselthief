import deepEqual from 'fast-deep-equal';
import { Collection, MongoClient, MongoServerError, type Filter, type WithId } from 'mongodb';
import ProgressBar from 'progress';
import { getAllVersions } from './git';
import { getSchemaObject, Schema } from './schema';
import { getVersion } from './version';
import log from 'npmlog';

import Dialog from './schema/Dialog';
import MainQuest from './schema/MainQuest';
import NPC from './schema/NPC';
import Quest from './schema/Quest';
import Reminder from './schema/Reminder';
import Talk from './schema/Talk';
import TextMap from './schema/TextMap';
import Material from './schema/Material';

const uri = 'mongodb://127.0.0.1:27017';

const client = new MongoClient(uri, { keepAlive: true });
const cachedVersionId: Record<string, number> = {};
let db = client.db('wt');
const dataVersion = 24103;

export async function initDatabase() {
	const integrity = await checkIntegrity();
	if (integrity !== 'ok') {
		log.info('db', 'regenerating database');
		console.time('regenerate');
		if (integrity === 'version') {
			await db.dropDatabase();
			db = client.db('wt');
			await addVersionReference();
			await addTextMaps();
		}

		if (integrity === 'schema') {
			for (const cs of [['Schema'], ...collections]) {
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
		await db.collection('Schema').insertOne({ name: '_wtDataVer', v: dataVersion });
		console.timeEnd('regenerate');
	}

	db.collection('Version')
		.find({})
		.forEach((e) => {
			cachedVersionId[e.hash] = e.vid;
		});
}

async function addVersionReference() {
	const coll = await db.createCollection('Version');
	const docs = [];
	for (const v of await getAllVersions()) {
		const shortver = /\d+\.\d+\.\d+/.exec(v.message)?.slice(-1)?.[0] ?? '???';
		const obj: any = {
			hash: v.hash,
			fullVersion: v.message,
			ver: shortver,
			vid: shortver
				.split('.')
				.map((e, i) => parseInt(e) * 100 ** (2 - i))
				.reduce((p, c) => p + c, 0)
		};
		obj['objectId'] = (await coll.insertOne(obj)).insertedId;
		docs.push(obj);
	}
	return docs;
}

type OneOrMany<T> = T | T[];
type KV = Record<string, unknown>;

const collections: [string, Schema, OneOrMany<KV>?][] = [
	['NPC', NPC, { Id: 1 }],
	['Quest', Quest],
	['MainQuest', MainQuest],
	['Dialog', Dialog, [{ Id: 1 }, { TalkRole__Id: 1 }, { NextDialogs: 1 }, { TalkContentTextMapHash: 1, TalkTitleTextMapHash: 1, TalkRoleNameTextMapHash: 1}]],
	['Talk', Talk, { Id: 1 }],
	['Reminder', Reminder, { Id: 1 }],
	['Material', Material, { Id: 1 }]
];

async function addCollections() {
	const schema = await db.createCollection('Schema');
	for (const cs of collections) {
		const coll = await db.createCollection(cs[0]);

		const currentObject: KV = {};
		let first = true;
		await foreachVersion(async (ver) => {
			try {
				const obj = await getSchemaObject(cs[1], ver.ver, ver.hash);
				if (first) {
				    log.info('db', `add reference ${cs[0]} ${ver.ver}`);
					await insertMany(
						coll as unknown as Collection<Document>,
						obj,
						(e) => e.map((v) => ({ _ver: ver.vid, ...v })),
						`${cs[0]} ${ver.ver}`
					);
					obj.forEach((v: { Id: string | number }) => {
						currentObject[v.Id] = v;
					});
					first = false;
					return;
				}

				const progress = new ProgressBar(`${cs[0]} ${ver.ver} [:bar] :current/:total d=:dirty`, {
					total: obj.length
				});
				let dirty = 0;
				for (const v of obj) {
					const id = v.Id;
					if (!deepEqual(currentObject[id], v)) {
						currentObject[id] = v;
						await coll.insertOne({
							_ver: ver.vid,
							...v
						});
						dirty++;
					}
					progress.tick({ dirty });
				}

				progress.terminate();
			} catch (e) {
				log.error('db', 'addCollection: failed to generate %s for %s', cs[0], ver);
				throw e;
			}
		});

		if (cs[2]) {
			const id = Array.isArray(cs[2]) ? cs[2] : [cs[2]];
			await coll.createIndexes(id.map((i) => ({ key: i })));
		}

		await schema.insertOne({
			name: cs[0],
			schema: cs[1],
			index: cs[2]
		});
	}
}

async function addTextMaps() {
	const textColl = await db.createCollection('TextMap');
	let [currentCn, currentEn, currentJp]: Record<string, string>[] = [{}, {}, {}];

	let first = true;
	await foreachVersion(async (ver) => {
		const cnLang = await getSchemaObject(TextMap, ver.ver, ver.hash, { lang: 'CHS' });
		const enLang = await getSchemaObject(TextMap, ver.ver, ver.hash, { lang: 'EN' });
		const jpLang = await getSchemaObject(TextMap, ver.ver, ver.hash, { lang: 'JP' });

		if (first) {
			log.info('db', `add reference TextMap ${ver.ver}`);
			await insertMany(
				textColl,
				Object.keys(cnLang),
				(v) =>
					v
						.map((k) => ({
							_ver: ver.vid,
							hash: parseInt(k),
							cn: cnLang[k],
							en: enLang[k],
							jp: jpLang[k]
						}))
						.filter((w) => w.cn !== '' || w.en !== '' || w.jp !== ''),
				`TextMap ${ver.ver}`
			);

			[currentCn, currentEn, currentJp] = [cnLang, enLang, jpLang];
			first = false;
			return;
		}

		const progress = new ProgressBar(`TextMap ${ver.ver} [:bar] :current/:total d=:dirty`, {
			total: Object.keys(cnLang).length
		});
		let dirty = 0;
		for (const k of Object.keys(cnLang)) {
			const object = {
				_ver: ver.vid,
				hash: parseInt(k),
				cn: cnLang[k],
				en: enLang[k],
				jp: jpLang[k]
			};

			// exclude empty strings
			if (cnLang[k] === '') {
				if (currentCn[k] !== undefined && currentCn[k] !== '') {
					Object.assign(object, { delete: true });
					await textColl.insertOne(object);
					delete currentCn[k];
				}

				progress.total--;
				continue;
			}

			const isDirty =
				currentCn[k] === undefined ||
				currentCn[k] !== (cnLang[k] ?? '') ||
				currentEn[k] !== (enLang[k] ?? '') ||
				currentJp[k] !== (jpLang[k] ?? '');

			if (isDirty) {
				[currentCn[k], currentEn[k], currentJp[k]] = [cnLang[k], enLang[k], jpLang[k]];
				await textColl.insertOne(object);
				dirty++;
			}
			progress.tick({ dirty });
		}

		progress.terminate();
		log.info('db', 'created %s TextMap', ver.ver);
	});

	log.info('db', ' create index for TextMap');
	await textColl.createIndex({ hash: 1 });
}

type Version = {
	_id: { oid: string };
	hash: string;
	fullVersion: string;
	ver: string;
	vid: number;
};

async function foreachVersion(cb: (doc: Version) => void) {
	const versions = db.collection('Version').find();
	const fw: WithId<Document>[] = [];
	await versions.forEach((o) => {
		fw.push(o);
	});
	// old version comes first
	for (const o of fw.reverse()) {
		await cb(o as unknown as Version);
	}
}

async function insertMany(
	coll: Collection<Document>,
	src: any[],
	mapper: (v: typeof src) => any[],
	progressName: string
) {
	const len = src.length;
	const sz = 10000;
	const progress = new ProgressBar(`${progressName} [:bar] :current/:total`, { total: len });
	for (let i = 0; i < Math.ceil(len / sz); i++) {
		const partData = mapper(src.slice(i * sz, (i + 1) * sz));
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

export function tillCurrentOid() {
	return { $lte: currentOid() };
}

export async function find(collection: string, query: any) {
	return findIter(collection, query).toArray();
}

export function findIter(collection: string, query: any) {
	return db.collection(collection).find(query).sort({ _ver: -1 });
}

export async function findOne(collection: string, query: Filter<Document>) {
	return findIter(collection, query).limit(1).next();
}

export function collection(name: string) {
	return db.collection(name);
}

async function checkIntegrity() {
	const hashes = (await getAllVersions()).map((ver) => ver.hash);
	const cnt = await db.collection('Version').find({}).toArray();
	if (cnt.length !== hashes.length) {
		log.warn('db', 'integrity: version size mismatch');
		return 'version';
	}

	const schemaColl = db.collection('Schema');
	if ((await schemaColl.findOne({ name: '_wtDataVer' }))?.v !== dataVersion) {
		log.warn('db', 'data version mismatch');
		return 'version';
	}

	for (const [name, schema, index] of collections) {
		const col = await schemaColl.findOne({ name });
		if (col === null) {
			log.warn('db', 'integrity: missing schema %s', name);
			return 'schema';
		}
		if (!deepEqual(col['schema'], schema) || !deepEqual(col['index'], index ?? null)) {
			log.warn('db', 'integrity: schema %s is outdated', name);
			return 'schema';
		}
	}
	return 'ok';
}

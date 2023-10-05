// import simpleGit from 'simple-git';
import log from 'npmlog';
import { readdir } from 'fs';
import { readFile } from 'fs/promises';

const git = {
	log: (_args: { file?: string; maxCount?: number }) => {
		return {
			all: [{ hash: 'local', message: 'local-release 10.0.0' }]
		};
	}
};

let gitOk = false;

export async function initGit() {
	log.warn('git', 'using filesystem layout as the only version');
	gitOk = true;
	// try {
	// 	git = simpleGit('./GenshinData');
	// 	if (!(await git.checkIsRepo())) throw new Error('data is not in a repository');
	// 	gitOk = true;
	// } catch (e) {
	// 	log.error('git', 'git module not enabled: %j', e);
	// 	throw e;
	// }
}

export function gitAvailable() {
	return gitOk;
}

export async function getVersioningCommit() {
	return (await git.log({ file: 'TextMap/', maxCount: 1 })).all[0];
}

export async function getAllVersions() {
	return (await git.log({ file: 'TextMap/TextMapCHS.json' })).all;
}

export async function getFile(name: string, _commit?: string): Promise<Buffer | null> {
	return await (await (readFile(`./GenshinData/${name}`))).toString();
	// const commit0 = commit ?? (await getVersioningCommit()).hash;

	// const k = await git.raw('ls-tree', commit0, name);
	// const v = k.replace('\t', ' ').split(' ')[2];
	// if (v?.length !== 40) {
	// 	return null;
	// }

	// return getFileBySHA(v);
}

// export async function getFileBySHA(sha: string): Promise<Buffer | null> {
// 	if (sha?.length !== 40) {
// 		return null;
// 	}
// 	return git.binaryCatFile(['blob', sha]);
// }

export async function getTree(filter: string): Promise<[string, string][] | null> {
	return new Promise((resolve, reject) => {
		readdir(filter, (err, files) => {
			if (err) {
				reject(err);
			} else {
				resolve(files.map(f => [filter, f]));
			}
		});
	});
}

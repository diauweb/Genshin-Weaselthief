import simpleGit from 'simple-git';
import log from 'npmlog';

let git: ReturnType<typeof simpleGit>;
let gitOk = false;

export async function initGit() {
	try {
		git = simpleGit('./GenshinData');
		if (!(await git.checkIsRepo())) throw new Error('data is not in a repository');
		gitOk = true;
	} catch (e) {
		log.error('git', 'git module not enabled: %j', e);
		throw e;
	}
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

export async function getFile(name: string, commit: string): Promise<Buffer | null> {
	const commit0 = commit ?? (await getVersioningCommit()).hash;

	const k = await git.raw('ls-tree', commit0, name);
	const v = k.replace('\t', ' ').split(' ')[2];
	if (v?.length !== 40) {
		return null;
	}

	return getFileBySHA(v);
}

export async function getFileBySHA(sha: string): Promise<Buffer | null> {
	if (sha?.length !== 40) {
		return null;
	}
	return git.binaryCatFile(['blob', sha]);
}

export async function getTree(filter: string, commit: string): Promise<[string, string][] | null> {
	const commit0 = commit ?? (await getVersioningCommit()).hash;
	const k = (await git.raw('ls-tree', '-r', commit0, filter)).trim();
	return k.split('\n').map(i => (([, , sha, name]) => [sha, name])(i.replace('\t', ' ').split(' ')));
}
import simpleGit from 'simple-git';
import log from 'npmlog';

let git: ReturnType<typeof simpleGit>;
let gitOk = false;

try {
	git = simpleGit('./GenshinData');
	if (!(await git.checkIsRepo())) throw new Error('data is not in a repository');
	gitOk = true;
} catch (e) {
    log.error('git', 'git module not enabled');
	throw e;
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
	const k = await git.raw('ls-tree', commit, name);
	const v = k.replace('\t', ' ').split(' ')[2];
	if (v?.length !== 40) {
		return null;
	}
	const resp = await git.binaryCatFile(['blob', v]);
	return resp;
}

import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import simpleGit from 'simple-git'

const git = simpleGit('.')
const config: UserConfig = {
	plugins: [sveltekit()],
	define: {
		__buildDate__: JSON.stringify(new Date()),
		__version__: JSON.stringify((await git.raw('describe', '--tags')).trim()),
		__branch__: JSON.stringify((await git.status()).current?.trim()),
	}
};

export default config;

import { getVersioningCommit } from './git';
import { initDatabase } from './db';
import { setVersion } from './version';
import log from 'npmlog';

let appInit: Promise<void>;

export let appInitState = false;
export async function ensureAppInit() {
    if (!appInit) appInit = initApp();
    return appInit;
}

export function isAppReady() {
    return appInitState;
}

async function initApp() {
    log.info('init', 'initing app version %j', __version__);
    setVersion((await getVersioningCommit()).hash);
    await initDatabase();
    log.info('init', 'app is ready');
    appInitState = true;
}

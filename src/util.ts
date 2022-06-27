import LRUCache from 'lru-cache'
import { getFile } from './git.js'


let jsons = new Map<string, Promise<any>>()
let hfiles = new LRUCache<string, Promise<string | undefined>>({ 
    max: 3
})

export function reset () {
    jsons.clear()
}

export function getContent (p: string, sha: string) : Promise<string | undefined> {
    if (!sha) {
        throw 'sha'
    }

    const fkey = `${p}@${sha}`
    const f = hfiles.get(fkey)
    if (f) {
        return f
    }

    async function getter (p: string, sha: string) {
        const f = await getFile(p, sha);
        if (f) return f.toString();
        else return undefined;
    }

    const g = getter(p, sha)
    hfiles.set(fkey, g)
    return g
}
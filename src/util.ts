import fse from 'fs-extra'
import LRUCache from 'lru-cache'
import path from 'path'
import { getFile } from './git.js'
import { getVersion } from './version.js'


let jsons = new Map<string, Promise<any>>()
let hfiles = new LRUCache<string, Promise<string | undefined>>({ 
    max: 12
})

export function reset () {
    jsons.clear()
}

export function getJSON(...pa : string[]) : () => Promise<any> {
    return function () : Promise<any> {
        const p = path.join(...pa)
        const f = jsons.get(p)
        if (f) {
            return f
        }

        async function getter (p: string) {
            let fv
            let v = getVersion()
            if (v) {
                fv = (await getFile(p, v))?.toString()
            }
            if (!fv) {
                fv = (await fse.readFile(path.join('.', 'GenshinData', p))).toString()
            }

            return JSON.parse(fv)
        }
        
        const g = getter(p)
        jsons.set(p, g)
        return g
    }
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
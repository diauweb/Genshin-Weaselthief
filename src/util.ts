import fse from 'fs-extra'
import path from 'path'
import { getCommit, gitAvailable, getFile } from './git.js'

let files = new Map<string, Promise<any>>()

let version : string | null = null 
if (gitAvailable()) {
    version = (await getCommit()).latest!.hash
}

export function setVersion (commitId: string) {
    if (!gitAvailable()) {
        return
    }
    version = commitId
    files.clear()
}

export function getVersion () {
    return version
}

export function getJSON(...pa : string[]) : () => Promise<any> {
    return function () : Promise<any> {
        const p = path.join(...pa)
        const f = files.get(p)
        if (f) {
            return f
        }

        async function getter (p: string) {
            let fv
            if (version) {
                fv = (await getFile(p, version))?.toString()
            }
            if (!fv) {
                fv = await (fse.readFile(path.join('.', 'GenshinData', ...p))).toString()
            }

            return JSON.parse(fv)
        }
        
        const g = getter(p)
        files.set(p, g)
        return g
    }
}

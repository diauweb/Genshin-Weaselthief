import fse from 'fs-extra'
import path from 'path'
import { getFile } from './git.js'
import { getVersion } from './version.js'

let files = new Map<string, Promise<any>>()

export function reset () {
    files.clear()
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
        files.set(p, g)
        return g
    }
}

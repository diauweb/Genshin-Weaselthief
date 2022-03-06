import fse from 'fs-extra'
import path from 'path'

export async function getJSON(...p : string[]) {
    return JSON.parse((await (fse.readFile(path.join('.', 'GenshinData', ...p)))).toString())
}

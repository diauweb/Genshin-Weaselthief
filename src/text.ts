import fse from 'fs-extra'
import path from 'path'

let chsMap = JSON.parse((await (fse.readFile(path.join('.', 'GenshinData', 'TextMap', 'TextMapCHS.json')))).toString())

export function searchText (text: string) {
    console.time(`search key: ${text}`)
    const ret = []
    let cnt = 0
    for (const [k, v] of Object.entries(chsMap)) {
        if ((v as string).includes(text)) {
            ret.push({
                id: k,
                value: v
            })
            cnt++
        }

        if(cnt > 50) {
            break
        }
    }

    console.timeEnd(`search key: ${text}`)
    return ret
}

export function getText (text: string) {
    return chsMap[text]
}
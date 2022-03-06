import fse from 'fs-extra'
import path from 'path'

async function readMap (lang: string) {
    return JSON.parse((await (fse.readFile(path.join('.', 'GenshinData', 'TextMap', `TextMap${lang}.json`)))).toString()) 
}

let chsMap = await readMap('CHS')
let jpMap  = await readMap('JP')
let enMap  = await readMap('EN') 

export function searchText (text: string, lang: string) {
    console.time(`search key: ${lang} ${text}`)
    let mmap
    switch (lang) {
        case 'EN':
            mmap = enMap; break
        case 'JP':
            mmap = jpMap; break 
        case 'CHS':
        default: 
            mmap = chsMap
    }

    const ret = []
    let more = false
    let cnt = 0
    for (const [k, v] of Object.entries(mmap)) {
        if ((v as string).includes(text)) {
            ret.push({
                id: k,
                value: v
            })
            cnt++
        }

        if(cnt > 100) {
          more = true
          break
        }
    }

    console.timeEnd(`search key: ${lang} ${text}`)
    return { result: ret, more }
}

export function getText (text: string) {
    return { CHS: chsMap[text], EN: enMap[text], JP: jpMap[text] }
}
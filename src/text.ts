import { getJSON } from './util'

function readMap (lang: string) {
    return getJSON('TextMap', `TextMap${lang}.json`)
}

let chsMap = readMap('CHS')
let jpMap  = readMap('JP')
let enMap  = readMap('EN') 

export async function searchText (text: string, lang: string) {
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

    mmap = await mmap()

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

export async function getText (text: string) {
    return { CHS: (await chsMap())[text], EN: (await enMap())[text], JP: (await jpMap())[text] }
}
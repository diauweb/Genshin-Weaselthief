import { getContent, getJSON } from './util.js'
import { compile, run } from './script/index.js'
import path from 'path'

function readMap (lang: string) {
    return getJSON('TextMap', `TextMap${lang}.json`)
}

let chsMap = readMap('CHS')
let jpMap  = readMap('JP')
let enMap  = readMap('EN') 

export async function searchText (text: string, lang: string) {
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
    type MatcherBinding = {
        $: string,
        key?: string
    }

    const matcherUtils = {
        has (v: string) : boolean {
            //@ts-ignore
            return this['$'].includes(v)
        }
    }

    let matcher: (b: MatcherBinding) => boolean = ({ $ }) => $.includes(text)

    if (text.startsWith('?')) {
        const ast = compile(text.substring(1))
        matcher = (binding) => {
            const rst = run(ast, binding)
            if (rst instanceof RegExp) return rst.test(binding.$)
            else return rst
        }
    }
    
    for (const [k, v] of Object.entries<string>(mmap)) {
        if (matcher({ key: k, $: v, ...matcherUtils })) {
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

    return { result: ret, more }
}

export async function getText (text: string) {
    return { CHS: (await chsMap())[text], EN: (await enMap())[text], JP: (await jpMap())[text] }
}

export async function getHistoryText (text: string, hs: string) {
    try {
        async function mp (lang: string) {
            const p = path.join('TextMap', `TextMap${lang}.json`)
            return getContent(p, hs)
        }
        
        let chsMap = JSON.parse(await mp('CHS'))
        let enMap = JSON.parse(await mp('EN'))
        let jpMap = JSON.parse(await mp('JP'))
    
        const ret = { CHS: chsMap[text], EN: enMap[text], JP: jpMap[text] }
        return ret
    } catch (e) {
        console.log(e)
        return { CHS: 'Error while getting text', EN: '', JP: ''}
    }
}

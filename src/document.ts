import { getContent, getJSON } from "./util.js"
import { getVersion } from "./version.js"

export async function getDocument (name: string, _sha?: string) {
    const sha = getVersion()

    // santize input
    const n = name.replace(/[\\/:"*?<>|]+ /, '')
    return {
        text: {
            CHS: await getContent(`Readable/CHS/${n}.txt`, sha!),
            EN: await getContent(`Readable/EN/${n}.txt`, sha!),
            JP: await getContent(`Readable/JP/${n}.txt`, sha!),
        }
    }
}

const docs = getJSON('ExcelBinOutput', 'DocumentExcelConfigData.json')
const locs = getJSON('ExcelBinOutput', 'LocalizationExcelConfigData.json')


export async function getAllDocuments () {
    const doc = await docs()
    const loc = await locs()

    function findLocalized (id : string) {
        for (const k of loc) {
            if (k.Id == id) return k
        }
    }

    return {
        result: (doc as [any]).map(e => ({
            Id: e.Id,
            TitleTextMapHash: e.TitleTextMapHash,
            content: findLocalized(e.ContentLocalizedId)?.DefaultPath
        }))
    }
}

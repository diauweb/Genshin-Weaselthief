import { getJSON } from "./util.js";

const role = await (async () => {
    let a = await getJSON('ExcelBinOutput', 'NpcExcelConfigData.json')
    let ret = new Map()
    for (const k of a) {
        ret.set(k.Id, k)
    }
    return ret
})()

export function getNpc (v : string) {
    return { result: role.get(parseInt(v)) }
}

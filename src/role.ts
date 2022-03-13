import { getJSON } from "./util.js";

const roles = getJSON('ExcelBinOutput', 'NpcExcelConfigData.json')

export async function getNpc (v : string) {
    for (const k of await roles()) {
        if (k.Id == v) {
            return { result: k }
        }
    }
}

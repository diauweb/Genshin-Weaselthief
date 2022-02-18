import fse from 'fs-extra'
import path from 'path'

async function getJSON(...p : string[]) {
    return JSON.parse((await (fse.readFile(path.join('.', 'GenshinData', ...p)))).toString())
}

const dialogTable = await getJSON('ExcelBinOutput', 'DialogExcelConfigData.json')
const talkTable = await getJSON('ExcelBinOutput', 'TalkExcelConfigData.json')

export function searchDialogContaining (mapId: string) {
    console.time(`search dialog ${mapId}`)
    const rst = []
    for (const o of dialogTable) {
        for (const [k, v] of Object.entries(o)) {
            if (k.endsWith("MapHash") && /* weak equal */ v == mapId) {
                rst.push(o)
                break
            }
        }
    }
    console.timeEnd(`search dialog ${mapId}`)
    return rst
}

export function getDialog (id: string | number) {
    for (const o of dialogTable) {
        if (o.Id == id) {
            return o
        }
    }
}

export function getAllDialogs (id: string) {
    console.time(`all_dialogs ${id}`)
    const baseDialog = getDialog(id)

    // backward find initial dialog first
    type Dialog = { Id: number, NextDialogs: number[] }
    function prev (k : Dialog) : Dialog {
        for (const o of dialogTable) {
            if (o.NextDialogs.includes(k.Id)) {
                return prev(o)
            }
        }
        return k
    }
    const first = prev(baseDialog)
    console.timeLog(`all_dialogs ${id}`, 'first', first.Id)

    const dialogs = new Map<number, Dialog>()
    dialogs.set(first.Id, first)

    function dfs (d: Dialog) {
        for (const n of d.NextDialogs) {
            if (dialogs.has(n)) continue
            const cur = getDialog(n)
            dialogs.set(n, cur)
            dfs(cur)
        }
    }
    dfs(first)

    console.timeEnd(`all_dialogs ${id}`)
    return Array.from(dialogs.values())
}
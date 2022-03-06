import { getJSON } from "./util.js"

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

export function searchTalkByDialog (id: string) {
    const baseDialog = getDialog(id)
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
    return searchTalkByInitDialog(first.Id)
}

export function searchTalkByInitDialog (id: string | number) {
    console.time(`search talk by init dialog ${id}`)
    const rst = []
    for (const o of talkTable) {
        if (o.InitDialog == id) { 
            rst.push(o)
            // quite not possible to find more
            break
        }
    }
    console.timeEnd(`search talk by init dialog ${id}`)
    return { result: rst }
}

export function getTalk (id: string) {
    for (const o of talkTable) {
        if (o.Id == id) { 
            return { result: o }
        }
    }
}
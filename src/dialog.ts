import { getJSON } from "./util.js"

const dialogTable = getJSON('ExcelBinOutput', 'DialogExcelConfigData.json')
const talkTable = getJSON('ExcelBinOutput', 'TalkExcelConfigData.json')

export async function searchDialogContaining (mapId: string) {
    console.time(`search dialog ${mapId}`)
    const rst = []
    for (const o of await dialogTable()) {
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

export async function getDialog (id: string | number) {
    for (const o of await dialogTable()) {
        if (o.Id == id) {
            return o
        }
    }
}

export async function getAllDialogs (id: string) {
    console.time(`all_dialogs ${id}`)
    const baseDialog = await getDialog(id)

    const dtb = await dialogTable()
    // backward find initial dialog first
    type Dialog = { Id: number, NextDialogs: number[] }
    function prev (k : Dialog) : Dialog {
        for (const o of dtb) {
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

    async function dfs (d: Dialog) {
        for (const n of d.NextDialogs) {
            if (dialogs.has(n)) continue
            const cur = await getDialog(n)
            dialogs.set(n, cur)
            await dfs(cur)
        }
    }
    await dfs(first)

    console.timeEnd(`all_dialogs ${id}`)
    return Array.from(dialogs.values())
}

export async function searchTalkByDialog (id: string) {
    const baseDialog = await getDialog(id)
    const dtb = await dialogTable()
    type Dialog = { Id: number, NextDialogs: number[] }
    function prev (k : Dialog) : Dialog {
        for (const o of dtb) {
            if (o.NextDialogs.includes(k.Id)) {
                return prev(o)
            }
        }
        return k
    }
    const first = prev(baseDialog)
    return searchTalkByInitDialog(first.Id)
}

export async function searchTalkByInitDialog (id: string | number) {
    console.time(`search talk by init dialog ${id}`)
    const rst = []
    for (const o of await talkTable()) {
        if (o.InitDialog == id) { 
            rst.push(o)
            // quite not possible to find more
            break
        }
    }
    console.timeEnd(`search talk by init dialog ${id}`)
    return { result: rst }
}

export async function getTalk (id: string) {
    for (const o of await talkTable()) {
        if (o.Id == id) { 
            return { result: o }
        }
    }
}
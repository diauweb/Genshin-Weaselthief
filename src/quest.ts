import { getJSON } from './util.js'

const quest = getJSON("ExcelBinOutput", "QuestExcelConfigData.json")
const mainQuest = getJSON("ExcelBinOutput", "MainQuestExcelConfigData.json")


export async function getQuests (id: string) {
    const rst = []
    let main
    for (const q of await quest()) {
        if (q.MainId == id) {
            rst.push(q)
        }
    }

    for(const q of await mainQuest()) {
        if(q.Id == id) {
            main = q
            break
        }
    }
    return { mainQuest: main, subQuests: rst }
}

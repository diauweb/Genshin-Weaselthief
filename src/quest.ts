import { getJSON } from './util.js'

const quest = await getJSON("ExcelBinOutput", "QuestExcelConfigData.json")
const mainQuest = await getJSON("ExcelBinOutput", "MainQuestExcelConfigData.json")


export function getQuests (id: string) {
    const rst = []
    let main
    for (const q of quest) {
        if (q.MainId == id) {
            rst.push(q)
        }
    }

    for(const q of mainQuest) {
        if(q.Id == id) {
            main = q
            break
        }
    }
    return { mainQuest: main, subQuests: rst }
}

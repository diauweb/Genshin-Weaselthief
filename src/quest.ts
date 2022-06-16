import { currentOid, find, findOne } from './db.js'
import { getJSON } from './util.js'

const quest = getJSON("ExcelBinOutput", "QuestExcelConfigData.json")
const mainQuest = getJSON("ExcelBinOutput", "MainQuestExcelConfigData.json")


export async function getQuests (id: string) {
    const main = await findOne("MainQuest", {
        _ver: currentOid(),
        Id: parseInt(id)
    });

    const rst = await find ("Quest", {
        _ver: currentOid(),
        MainId: parseInt(id)
    })
    return { mainQuest: main, subQuests: rst }
}

import { currentOid, find, findOne } from './db.js'

export async function getQuests (id: string) {
    const main = await findOne("MainQuest", {
        _ver: currentOid(),
        Id: parseInt(id)
    });

    const rst = await find("Quest", {
        _ver: currentOid(),
        MainId: parseInt(id)
    })
    return { mainQuest: main, subQuests: rst }
}

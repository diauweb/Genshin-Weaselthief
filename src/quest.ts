import { currentOid, find, findOne } from './db.js'
import { inlineLanguage } from './util.js';

export async function getQuests (id: string) {
    const main = await findOne("MainQuest", {
        _ver: currentOid(),
        Id: parseInt(id)
    });

    const rst = await find("Quest", {
        _ver: currentOid(),
        MainId: parseInt(id)
    })
    return { mainQuest: await inlineLanguage(main), subQuests: await Promise.all(rst.map(inlineLanguage)) }
}

import { tillCurrentOid, find, findOne } from './db.js';
import { inlineLanguage } from './util.js';

export async function getQuests (id: string) {
    const main = await findOne("MainQuest", {
        _ver: tillCurrentOid(),
        Id: parseInt(id)
    });

    const rst = await find("Quest", {
        _ver: tillCurrentOid(),
        MainId: parseInt(id)
    })
    return { mainQuest: await inlineLanguage(main), subQuests: await Promise.all(rst.map(inlineLanguage)) }
}

import { WithId, Document } from "mongodb";
import { tillCurrentOid, find, findIter, findOne } from "./db.js";
import { inlineLanguage } from "./util.js";

export async function getNpc (v : string) {
    const result = await findOne("NPC", {
        _ver: tillCurrentOid(),
        Id: parseInt(v)
    });
    
    return { result: await inlineLanguage(result) };
}

export async function getAllNpcs() {
    const result = await find("NPC", {
        _ver: tillCurrentOid()
    })
    
    return { result: await Promise.all(result.map(inlineLanguage)) }
}

export async function getDetailNpc(v: string) {
    const npc = await inlineLanguage((await getNpc(v)).result);

    const matchers = (await find('TextMap', {
        _ver: tillCurrentOid(),
        cn: npc.NameTextMapHash.cn,
    })).map(e => e.hash);

    const dialogs: WithId<Document>[] = [];
    const reminders: WithId<Document>[] = [];

    const reminderIter = await findIter("Reminder", {
        _ver: tillCurrentOid(),
        SpeakerTextMapHash: { $in: matchers }
    })
    reminderIter.limit(500);
    await reminderIter.forEach(e => { reminders.push(e) });

    const dialogIter = findIter("Dialog", {
        _ver: tillCurrentOid(),
        TalkRole__Id: npc.Id.toString(),
    })
    dialogIter.limit(500);
    await dialogIter.forEach(e => { dialogs.push(e) });

    return {
        npc,
        reminders: await Promise.all(reminders.map(inlineLanguage)),
        dialogs: await Promise.all(dialogs.map(inlineLanguage)),
    }
}

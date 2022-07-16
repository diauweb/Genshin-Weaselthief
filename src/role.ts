import { WithId, Document } from "mongodb";
import { currentOid, find, findIter, findOne } from "./db.js";
import { inlineLanguage } from "./util.js";

export async function getNpc (v : string) {
    const result = await findOne("NPC", {
        _ver: currentOid(),
        Id: parseInt(v)
    });
    
    return { result: await inlineLanguage(result) };
}

export async function getAllNpcs() {
    const result = await find("NPC", {
        _ver: currentOid()
    })
    
    return { result: await Promise.all(result.map(inlineLanguage)) }
}

export async function getDetailNpc(v: string) {
    const npc = await inlineLanguage((await getNpc(v)).result);

    const matchers = (await find('TextMap', {
        _ver: currentOid(),
        cn: npc.NameTextMapHash.cn,
    })).map(e => e.hash);

    const dialogs: WithId<Document>[] = [];
    const reminders: WithId<Document>[] = [];

    const reminderIter = await findIter("Reminder", {
        _ver: currentOid(),
        SpeakerTextMapHash: { $in: matchers }
    })
    reminderIter.limit(500);
    await reminderIter.forEach(e => { reminders.push(e) });

    const dialogIter = findIter("Dialog", {
        _ver: currentOid(),
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

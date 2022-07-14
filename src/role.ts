import { currentOid, findOne } from "./db.js";
import { inlineLanguage } from "./util.js";

export async function getNpc (v : string) {
    const result = await findOne("NPC", {
        _ver: currentOid(),
        Id: parseInt(v)
    });
    
    return { result: inlineLanguage(result) };
}

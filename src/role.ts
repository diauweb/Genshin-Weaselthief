import { currentOid, findOne } from "./db.js";

export async function getNpc (v : string) {
    const result = await findOne("NPC", {
        _ver: currentOid(),
        Id: parseInt(v)
    });
    
    return { result };
}

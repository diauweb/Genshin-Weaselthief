import { currentOid, findOne } from "./db.js";

export async function getNpc (v : string) {
    return findOne("NPC", {
        _ver: currentOid(),
        Id: parseInt(v)
    });
}

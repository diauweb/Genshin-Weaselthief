import { getAllNpcs } from '$lib/server/role';
import { toPlainObject } from '$lib/util';
 
export const load: PageLoad = async () => {
    const npcs = await getAllNpcs();
    return {
        npcs: toPlainObject(npcs),
    };
};
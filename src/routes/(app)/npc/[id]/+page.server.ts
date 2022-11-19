import { getDetailNpc } from '$lib/server/role';
import { toPlainObject } from '$lib/util';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    const id = params.id;
    if (!id) throw error(404);

    const npc = await getDetailNpc(id);
    return toPlainObject(npc);
};
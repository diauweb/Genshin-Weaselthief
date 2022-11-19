
import { getQuests } from '$lib/server/quest';
import { toPlainObject } from '$lib/util';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    const id = params.id;
    if (!id) throw error(404);

    const quest = await getQuests(id);
    return toPlainObject({
        id,
        quest,
    });
};
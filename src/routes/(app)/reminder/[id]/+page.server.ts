
import { searchAllReminder } from '$lib/server/dialog';
import { getNpc } from '$lib/server/role';
import { toPlainObject } from '$lib/util';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    const id = params.id;
    if (!id) throw error(404);

    const reminders = await searchAllReminder(id);
    return toPlainObject({
        id,
        reminders,
    });
};
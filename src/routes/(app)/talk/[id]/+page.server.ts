
import { getTalk, getAllDialogs } from '$lib/server/dialog';
import { getNpc } from '$lib/server/role';
import { toPlainObject } from '$lib/util';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    const id = params.id;
    if (!id) throw error(404);

    const talk = await getTalk(id);
    const dialogs = await getAllDialogs(talk.InitDialog);
	const npcs = talk? await Promise.all(talk.NpcId.map((n) => getNpc(n))) : null;
    return toPlainObject({
        id,
        talk,
        dialogs,
        npcs,
    });
};
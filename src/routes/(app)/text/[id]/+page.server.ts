import type {PageServerLoad} from './$type';
import {getAllText, getText} from '$lib/server/text';
import {getNpc} from '$lib/server/role';
import {searchDialogContaining, searchReminder, searchTalkByDialog} from '$lib/server/dialog';
import {toPlainObject} from '$lib/util';
import {error} from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
	if (!params.id) throw error(404);

	console.time(`aggrerate_search_${params.id}`);
	const [text, history, dialog] = await Promise.all([
		getText(params.id),
		getAllText(params.id),
		searchDialogContaining(params.id)
	]);

	if (!text) {
		console.timeEnd(`aggrerate_search_${params.id}`);
		throw error(404);
	}

	const reminder = dialog ? null : await searchReminder(params.id);

	const talk = dialog?.Id ? await searchTalkByDialog(dialog.Id) : null;
	const npcs = talk ? await Promise.all(talk.NpcId.map((n) => getNpc(n))) : null;

	console.timeEnd(`aggrerate_search_${params.id}`);

	return {
		id: params.id,
		text: toPlainObject(text),
		history: toPlainObject(history),
		dialog: toPlainObject(dialog),
		talk: toPlainObject(talk),
		npcs: toPlainObject(npcs),
		reminder: toPlainObject(reminder),
	};
};

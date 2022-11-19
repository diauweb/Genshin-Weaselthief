import type { RequestHandler } from './$type';
import { getText } from '$lib/server/text';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async function({ url }) {
    const id = url.searchParams.get('id');
    if (!id) throw error(404);

    const text = await getText(id);
    return new Response(JSON.stringify(text));
}

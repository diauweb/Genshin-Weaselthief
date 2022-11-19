import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { searchText } from '$lib/server/text';
import { toPlainObject } from '$lib/util';

export const load: PageServerLoad = async ({ url }) => {
    const kw = url.searchParams.get('kw') as string;
    const lang = url.searchParams.get('lang') ?? 'cn';

    if (!kw) {
        throw error(400, 'no keyword provided');
    }

    const v = toPlainObject({ kw, ...await searchText(kw, lang) });
    return v;
};

import type {PageServerLoad} from './$types';
import {getTree} from "$lib/server/git";

export const load: PageServerLoad = async () => {
    const files = await getTree('ExcelBinOutput');
    return {
        files: files.map(e => e[1]?.replace(/(^ExcelBinOutput\/)|(\.json$)/g, ''))
    };
}

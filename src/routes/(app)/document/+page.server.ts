import {toPlainObject} from '$lib/util';
import {inlineLanguage} from "$lib/server/util";
import {find, tillCurrentOid} from '$lib/server/db';
import type {PageServerLoad} from "./$types";

export const load: PageServerLoad = async () => {
    const documents = await find('Document', {
        _ver: tillCurrentOid(),
        ContentLocalizedId: {$exists: true},
    });
    const d = await Promise.all(documents.map(e => inlineLanguage({...e, _ver: tillCurrentOid()})));
    return {
        documents: toPlainObject(d),
    };
};

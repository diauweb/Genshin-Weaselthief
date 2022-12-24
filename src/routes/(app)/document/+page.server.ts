import { toPlainObject } from '$lib/util';
import { inlineLanguage } from "$lib/server/util";
import { tillCurrentOid, currentOid, find } from '$lib/server/db';

export const load: PageLoad = async () => {
    const documents = await find('Document', {
        _ver: currentOid(),
    });
    const d = await Promise.all(documents.map(e => inlineLanguage({...e, _ver: tillCurrentOid()})));
    return {
        documents: toPlainObject(d),
    };
};
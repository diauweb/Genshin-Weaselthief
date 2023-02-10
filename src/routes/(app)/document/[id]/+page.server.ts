import {toPlainObject} from '$lib/util';
import {error} from '@sveltejs/kit';
import {findOne, tillCurrentOid} from "$lib/server/db";
import {getVersion} from "$lib/server/version";
import {getFile} from "$lib/server/git";
import log from 'npmlog';

// import { inlineLanguage } from "$lib/server/util";

export const load: PageServerLoad = async ({params}) => {
    const id = params.id;
    if (!id) throw error(404);

    const document = await findOne('Document', {
        _ver: tillCurrentOid(),
        Id: parseInt(id),
    });

    const content = await findOne('Localization', {
        _ver: tillCurrentOid(),
        Id: document.ContentLocalizedId,
    });
    
    const path = content.DefaultPath.split('/').slice(-1)[0];
    const text = {};
    try {
        const readablePath = (lang, name) => `Readable/${lang}/${name}${lang === 'CHS' ? '' : '_' + lang}.txt`;
        const sha = getVersion();
        text['cn'] = (await getFile(readablePath('CHS', path), sha)).toString();
        text['en'] = (await getFile(readablePath('EN', path), sha)).toString();
        text['jp'] = (await getFile(readablePath('JP', path), sha)).toString();
    } catch (e) {
        log.error(e);
    }

    // const d = await inlineLanguage(document);
    return {
        document: toPlainObject(document),
        content: toPlainObject(content),
        text,
    };
};
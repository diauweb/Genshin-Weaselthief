import { currentOid, find, findIter, findOne } from './db.js'

export async function searchText (text: string, lang: string) {
    type Text = {
        cn: string, en: string, jp: string
    };
    const ret: Text[] = [];

    let plang;
    switch (lang) {
        case 'en':
            plang = 'en'; break
        case 'jp':
            plang = 'jp'; break
        case 'chs':
        default: 
            plang = 'cn';
    }

    const iter = await findIter('TextMap', {
        _ver: currentOid(),
        [plang]: {
            $regex: text,
            $options: 'i'
        }
    });
    iter.limit(1000);
    let cnt = 0;
    await iter.forEach(e => { ret.push(e as unknown as Text); cnt++; });
    return { result: ret, more: cnt >= 1000 }
}

export async function getText (text: string) {
    return findOne ('TextMap', {
        _ver: currentOid(),
        hash: parseInt(text),
    })
}

export async function getAllText (text: string) {
    const result = await find('TextMap', {
        hash: parseInt(text),
    });

    return { result };
}

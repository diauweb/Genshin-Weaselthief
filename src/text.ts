import { currentOid, findIter, findOne, getVersionOid } from './db.js'

export async function searchText (text: string, lang: string) {
    type Text = {
        cn: string, en: string, jp: string
    };
    const ret: Text[] = [];

    let plang;
    switch (lang) {
        case 'EN':
            plang = 'en'; break
        case 'JP':
            plang = 'jp'; break 
        case 'CHS':
        default: 
            plang = 'cn';
    }

    const iter = await findIter('TextMap', {
        _ver: currentOid(),
        [plang]: {
            $regex: text
        }
    });
    iter.limit(101);
    let cnt = 0;
    iter.forEach(e => { ret.push(e as unknown as Text); cnt++; });
    return { result: ret, more: cnt >= 101 }
}

export async function getText (text: string) {
    return findOne ('TextMap', {
        _ver: currentOid(),
        hash: parseInt(text),
    })
}

export async function getHistoryText (text: string, hs: string) {
    try {
        return findOne ('TextMap', {
            _ver: getVersionOid(hs),
            hash: parseInt(text)
        })
    } catch (e) {
        console.log(e)
        return { cn: 'Error while getting text', en: '', jp: ''}
    }
}

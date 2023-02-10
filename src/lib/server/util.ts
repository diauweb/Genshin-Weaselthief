import {find} from './db.js'
import {getText} from "$lib/server/text";
import {toPlainObject} from "$lib/util";

export async function inlineLanguage(resultItem: any) {
    const translate: Record<string, string> = {};
    for (const k of Object.keys(resultItem)) {
        if (!k.endsWith("TextMapHash")) continue;
        translate[resultItem[k]] = k;
    }

    const q = (await find("TextMap", {
        _ver: resultItem._ver,
      hash: { $in: Object.keys(translate).map(i => parseInt(i)) }
    }))
    q.forEach(e => resultItem[translate[e.hash]] = e)
    Object.values(translate).forEach(e => {
        if (typeof resultItem[e] !== 'object') {
            const hs = resultItem[e]
            resultItem[e] = {hash: hs}
        }
    })

    return resultItem;
}


export type ZippedExcel = { mapper: string[], table: any[][] };

export async function zipExcel(obj: Record<string, any>[]): ZippedExcel {
    let n = 1;
    const map = new Map<string, number>();
    map.set("#", 0);

    const table = [];
    for (let ii = 0; ii < obj.length; ii++) {
        const i = obj[ii];
        const cur: any[] = [ii];
        for (const k of Object.keys(i)) {
            if (!map.has(k)) map.set(k, n++);
            if (k.endsWith('MapHash')) {
                cur[<number>map.get(k)] = {hash: i[k], ...toPlainObject(await getText(i[k]))};
            } else {
                cur[<number>map.get(k)] = i[k];
            }
        }
        table.push(cur);
    }

    const mapper: string[] = [];
    map.forEach((value, key) => mapper[value] = key);
    return {
        mapper,
        table,
    }
}
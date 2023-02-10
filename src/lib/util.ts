import {getText} from "$lib/server/text";

export function toPlainObject<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

export function toDotVersion(number: number) {
    const major = Math.floor(number / 10000);
    const minor = Math.floor((number - major * 10000) / 100);
    const revision = number - major * 10000 - minor * 100;

    return `${major}.${minor}.${revision}`;
}

export function stripBsid(obj: any) {
    const newobj = {...obj};
    for (const [k, v] of Object.entries(newobj)) {
        if (k === "_id") delete newobj[k];
        if (typeof v === 'object') newobj[k] = stripBsid(v);
    }
    return newobj;
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
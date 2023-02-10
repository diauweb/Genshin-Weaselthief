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

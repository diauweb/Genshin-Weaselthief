import satisfies from 'semver/functions/satisfies.js';
import { getContent } from './util.js';

export type Schema = {
    match: string;
    type?: 'all' | 'remap' | string;
    filename?: string;
    remap?: any;
}[];

export async function getSchemaObject (schema: Schema | ((args: any) => Schema), version: string, sha: string, args?: any) {
    let inherits = {}
    const sch = typeof schema === 'function' ? schema({ version, sha, ...args }) : schema;

    for (const k of sch) {
        if (k.match === '**') {
            inherits = k;
        } else if (satisfies(version, k.match) || sha === k.match) {
            const conf = {...inherits, ...k};
            const content = await getContent(conf.filename!, sha)
            if (!content) {
                throw `${conf.filename} @ ${sha} do not exists`;
            }
            const srcFile = JSON.parse(content);
            switch (conf.type) {
                case 'all': return srcFile;
                case 'remap': return remapJSON(k.remap, srcFile);
                case 'remapColl': return srcFile.map((e: any) => remapJSON(k.remap, e));
                default: throw `unknown rule ${conf.type}`;
            }
        }
    }
    throw `no suitable rule for version ${version}`
}

function byString (o: any, s: any) {
    s = s.replace(/\[(\w+)\]/g, '.$1');
    s = s.replace(/^\./, '');
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

function remapJSON (remapRule: any, raw: any) {
    function remap(t: any) {
        const current: any = {}
        for(const k of Object.keys(t)) {
            const v = t[k];
            if (typeof v === "string") {
                current[k] = byString(raw, v);
            } else if (typeof v === 'object') {
                current[k] = remap(v);
            }
        }
        return current;
    }
    return remap(remapRule);
}
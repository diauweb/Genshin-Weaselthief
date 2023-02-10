import type {PageServerLoad} from "./$types";
import {error} from "@sveltejs/kit";
import LRU from 'lru-cache';
import {getFile} from "$lib/server/git";
import type {ZippedExcel} from "$lib/util";
import {zipExcel} from "$lib/util";

const cache = new LRU<string, ZippedExcel>({
    ttl: 60000 * 10,
    maxSize: 50000,
    sizeCalculation: (value) => value.table.length
});

// export const ssr = false;
export const load: PageServerLoad = async ({params, url}) => {
    const name = params.name;
    let page = ~~url.searchParams.get('page');
    if (page <= 0) page = 1;

    if (!name) throw error(404);

    let tableData: ZippedExcel;
    if (cache.has(name)) {
        tableData = cache.get(name);
    } else {
        const jsonData = JSON.parse((await getFile(`ExcelBinOutput/${name}.json`)));
        if (jsonData.length <= 10000) {
            tableData = await zipExcel(jsonData);
        } else {
            tableData = {
                mapper: ["Cannot display this table"],
                table: [
                    [`This table is too huge. (${jsonData.length} entries)`],
                    ['Please search its content instead.']
                ]
            }
        }
        if (tableData) {
            cache.set(name, tableData);
        }
    }

    const len = tableData.table.length;
    const begin = (page - 1) * 100;
    return {
        name,
        page,
        allPage: Math.ceil(len / 100),
        len,
        data: {
            mapper: tableData.mapper,
            table: tableData.table.slice(begin, begin + 100),
        }
    };
}

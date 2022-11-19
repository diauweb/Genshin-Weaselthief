import { findOne, currentOid } from '$lib/server/db';
import { toPlainObject } from '$lib/util';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
    return { dataver: toPlainObject(await findOne('Version', { vid: currentOid() })) };
};

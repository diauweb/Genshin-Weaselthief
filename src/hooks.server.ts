import { ensureAppInit, isAppReady } from '$lib/server/init';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	ensureAppInit();
	const isLoadingPage = event.url.pathname.startsWith('/loading');
	const isReady = isAppReady();

	// XNOR
	if (isLoadingPage === isReady) {
		if (isReady) {
			const redirect = event.url.searchParams.get("redirect");
			if (redirect) {
				return Response.redirect(new URL(`${decodeURIComponent(redirect)}`, event.url.origin));
			} else {
				return Response.redirect(event.url.origin);
			}
		} else {
			const redirect = `?redirect=${encodeURIComponent(event.url.pathname+event.url.search)}`;
			return Response.redirect(new URL(`/loading${redirect}`, event.url.origin));
		}
	}

	return await resolve(event);
};

import type { Actions } from './$types';
import { redirect } from "@sveltejs/kit";

export const actions: Actions = {
    async default({ request }) {
        const form = await request.formData();
        const kw = form.get('kw') as string;
        let lang = form.get('lang') as string;

        if (!kw) {
            return { error: 'no keyword provided' };
        }

        if (!['cn', 'en', 'jp'].includes(lang)) {
            lang = 'cn';
        }
        
        throw redirect(302, `/search?kw=${encodeURIComponent(kw)}&lang=${lang}`);
    }
};
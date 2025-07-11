import {
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY
} from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	/**
	 * a little helper that is written for convenience so that
	 * we don't have to worry about managing sessions
	 */
	let {
		data: { session }
	} = await event.locals.supabase.auth.getSession();

	if (session) {
		const {
			data: { user }
		} = await event.locals.supabase.auth.getUser();
		if (user) {
			session.user = user;
		} else {
			session = null;
		}
	}

	event.locals.session = session;

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		},
		/**
		 * Supabase auth helpers do not work with streaming because of the cookie finalizing logic.
		 * So we disable streaming for all responses.
		 *
		 * https://github.com/sveltejs/kit/pull/11499
		 */
		transformPageChunk: ({ html }) => html
	});
};
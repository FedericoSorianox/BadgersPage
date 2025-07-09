import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';

export const handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: 'https://hmohjwrwpuwmyecdxgon.supabase.co',
		supabaseKey:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtb2hqd3J3cHV3bXllY2R4Z29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4ODYyMTMsImV4cCI6MjA2NDQ2MjIxM30.MBVkKFd4zfvXxfG_TH5QZTyUTRNeBCTXXFZrB3Q4fEc',
		event
	});

	/**
	 * a little helper that is written for convenience so that
	 * we don't have to worry about managing sessions
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
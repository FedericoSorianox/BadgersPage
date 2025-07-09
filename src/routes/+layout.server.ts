import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (session) {
		const { data: profile } = await supabase
			.from('clients')
			.select(`role`)
			.eq('user_id', session.user.id)
			.single();

		return {
			session,
			profile
		};
	}

	return { session, profile: null };
}; 
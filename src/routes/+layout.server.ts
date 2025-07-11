import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase, session } }) => {
	let profile = null;

	if (session) {
		const { data, error } = await supabase
			.from('clients')
			.select(`role`)
			.eq('user_id', session.user.id)
			.single();

		if (error) {
			console.error('Error fetching profile:', error);
		} else {
			profile = data;
		}
	}

	const { data: settingsData, error: settingsError } = await supabase
		.from('site_settings')
		.select('key, value');

	if (settingsError) {
		console.error('Error fetching site settings:', settingsError);
	}

	const siteSettings = settingsData
		? Object.fromEntries(settingsData.map((item: { key: string; value: string }) => [item.key, item.value]))
		: {};

	return {
		session,
		profile,
		siteSettings
	};
}; 
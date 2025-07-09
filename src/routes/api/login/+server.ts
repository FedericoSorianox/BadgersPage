import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	const { username, password } = await request.json();

	if (!username || !password) {
		throw error(400, 'Username and password are required');
	}

	// Construct the dummy email from the username, which is required by Supabase Auth
	const email = `${username.toLowerCase().replace(/\s+/g, '.')}@badgers.com`;

	const { data, error: authError } = await supabase.auth.signInWithPassword({
		email,
		password
	});

	if (authError) {
		// Forward the actual error message from Supabase for better debugging
		throw error(401, authError.message);
	}

	return json({ session: data.session });
}; 
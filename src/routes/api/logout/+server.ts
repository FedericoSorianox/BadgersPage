import { json } from '@sveltejs/kit';

export const POST = async ({ locals: { supabase } }) => {
	await supabase.auth.signOut();
	return json({ success: true });
}; 
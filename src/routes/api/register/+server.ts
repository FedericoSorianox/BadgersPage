import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals: { supabase } }) => {
	const { email, password } = await request.json();

	const { data, error } = await supabase.auth.signUp({ email, password });

	if (error) {
		return json({ error: error.message }, { status: 400 });
	}

	// La cookie de sesión se setea automáticamente si el registro es exitoso
	return json({ user: data.user });
}; 
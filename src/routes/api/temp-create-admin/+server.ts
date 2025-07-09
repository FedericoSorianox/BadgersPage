import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { PRIVATE_SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

// IMPORTANT: This is a temporary script to create an admin user.
// It should be deleted immediately after use.

export const GET: RequestHandler = async () => {
	// Initialize a new Supabase client with the service role key
	const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_ROLE_KEY, {
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	});

	const username = 'Badgeradmin';
	const password = 'badgers2025!@#';
	const role = 'admin';
	const email = `${username.toLowerCase().replace(/\s+/g, '.')}@badgers.com`;

	// Step 1: Create the user in Supabase Auth
	const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
		email: email,
		password: password,
		email_confirm: true,
		user_metadata: { name: username, role: role }
	});

	if (createError) {
		if (createError.message.includes('User already registered')) {
			return json({ message: `Error: El usuario con el email '${email}' ya existe. Bórralo primero desde el panel de Supabase.` }, { status: 409 });
		}
		return json({ message: `Error al crear usuario en Auth: ${createError.message}` }, { status: 500 });
	}

	if (!authUser || !authUser.user) {
		return json({ message: 'No se pudo crear el usuario en Auth.' }, { status: 500 });
	}

	// Step 2: Update the record in the 'clients' table that was created by the trigger
	const { error: updateError } = await supabaseAdmin
		.from('clients')
		.update({
			name: username,
			role: role
		})
		.eq('user_id', authUser.user.id);

	if (updateError) {
		// If updating the client fails, delete the auth user to avoid orphaned records.
		await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
		return json({ message: `Error al actualizar la tabla de clientes: ${updateError.message}` }, { status: 500 });
	}

	return json({ success: true, message: `Usuario administrador '${username}' creado y actualizado con éxito.` });
}; 
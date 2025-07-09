import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { env } from '$env/dynamic/private';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const password = formData.get('password') as string;
		const role = formData.get('role') as string;

		if (!name || !password || !role) {
			return fail(400, { message: 'Por favor, completa todos los campos.' });
		}
		
		const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
		if (!serviceKey) {
			return fail(500, { message: 'La clave de servicio de Supabase no está configurada en el servidor.' });
		}

		// Create a new Supabase client with the service role key for admin operations
		const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, serviceKey, {
			auth: {
				autoRefreshToken: false,
				persistSession: false
			}
		});

		// Construct a dummy email from the username
		// This is required by Supabase Auth
		const email = `${name.toLowerCase().replace(/\s+/g, '.')}@badgers.com`;

		// Create the user in Supabase Auth using the admin client
		const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
			email: email,
			password: password,
			email_confirm: true, // Auto-confirm the dummy email
			user_metadata: {
				name: name,
				role: role
			}
		});

		if (createError) {
			console.error('Error creating user:', createError);
			return fail(500, { message: `Error al crear usuario: ${createError.message}` });
		}

		if (!newUser || !newUser.user) {
			return fail(500, { message: 'No se pudo crear el usuario.' });
		}

		// The trigger on `auth.users` should create a corresponding row in `clients`.
		// Now, we update that row with the full name and role.
		// Use the admin client here as well to ensure permissions.
		const { error: updateError } = await supabaseAdmin
			.from('clients')
			.update({ name: name, role: role })
			.eq('user_id', newUser.user.id);

		if (updateError) {
			// If updating fails, we should probably delete the auth user we just created to avoid orphaned users.
			await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
			console.error('Error updating client table:', updateError);
			return fail(500, { message: `Error al actualizar perfil de usuario: ${updateError.message}` });
		}

		return { success: true, message: `Usuario "${name}" creado con éxito.` };
	}
}; 
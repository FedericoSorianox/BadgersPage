import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: socios, error } = await supabase
		.from('clients')
		.select(
			`
      id,
      user_id,
      name,
      ci,
      phone,
      membership_type,
      status,
      photo_url,
      birth_date,
      emergency_contact_name,
      emergency_contact_phone,
      illnesses,
      comments
    `
		)
		.neq('role', 'admin')
		.order('name', { ascending: true });

	if (error) {
		console.error('Error loading socios:', error);
		return { socios: [] };
	}

	return { socios };
};

export const actions: Actions = {
	addSocio: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;

		if (!name) {
			return fail(400, { success: false, message: 'El nombre es obligatorio.' });
		}

		// 1. Crear cliente admin de Supabase
		const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
		if (!serviceKey) {
			return fail(500, { message: 'La clave de servicio de Supabase no está configurada.' });
		}
		const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, serviceKey, {
			auth: { autoRefreshToken: false, persistSession: false }
		});

		// 2. Generar email y contraseña
		const email = `${name.toLowerCase().replace(/\s+/g, '.')}@badgers.com`;
		const password = name.toLowerCase().replace(/\s+/g, '');

		// 3. Crear usuario en Supabase Auth
		const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
			email,
			password,
			email_confirm: true,
			user_metadata: { name, role: 'user' }
		});

		if (createError) {
			console.error('Error creating user:', createError);
			return fail(500, { success: false, message: `Error al crear usuario: ${createError.message}` });
		}

		// 4. Subir foto si existe
		let photo_url = '';
		const photoFile = formData.get('photo') as File;
		if (photoFile && photoFile.size > 0) {
			const fileName = `${newUser.user.id}/${Date.now()}_${photoFile.name}`;
			const { data: uploadData, error: uploadError } = await supabase.storage
				.from('avatars')
				.upload(fileName, photoFile);

			if (uploadError) {
				console.error('Upload error:', uploadError);
				// No hacemos fallar la operación completa, pero sí lo registramos
			} else {
				const { data: publicUrlData } = supabase.storage
					.from('avatars')
					.getPublicUrl(uploadData.path);
				photo_url = publicUrlData.publicUrl;
			}
		}

		// 5. Preparar y actualizar datos del socio en la tabla `clients`
		const socioData = {
			name,
			ci: formData.get('ci') as string,
			phone: formData.get('phone') as string,
			birth_date: formData.get('birth_date') as string,
			membership_type: formData.get('membership_type') as string,
			emergency_contact_name: formData.get('emergency_contact_name') as string,
			emergency_contact_phone: formData.get('emergency_contact_phone') as string,
			illnesses: formData.get('illnesses') as string,
			comments: formData.get('comments') as string,
			photo_url
		};

		const { error: updateError } = await supabase
			.from('clients')
			.update(socioData)
			.eq('user_id', newUser.user.id);

		if (updateError) {
			console.error('Error updating client:', updateError);
			return fail(500, { success: false, message: `Error al actualizar datos del socio: ${updateError.message}` });
		}

		return { success: true, message: 'Socio agregado con éxito.' };
	},

	deleteSocio: async ({ request, locals }) => {
		const { supabase } = locals;
		const formData = await request.formData();
		const userId = formData.get('user_id') as string;
		const clientId = formData.get('id') as string;

		if (!clientId) {
			return fail(400, { success: false, message: 'Client ID no proporcionado.' });
		}

		// 1. Borrar de la tabla `clients`
		const { error: clientError } = await supabase.from('clients').delete().eq('id', clientId);

		if (clientError) {
			console.error('Error deleting client:', clientError);
			return fail(500, {
				success: false,
				message: `Error al eliminar socio de la base de datos: ${clientError.message}`
			});
		}

		// 2. Si el socio tenía un usuario de autenticación asociado, borrarlo también
		if (userId && userId !== 'null') {
			// Usar cliente admin para borrar el usuario de Auth
			const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
			if (!serviceKey) {
				// Esto es un problema, porque el cliente ya fue borrado.
				// Deberíamos registrar este error de forma crítica.
				console.error('CRITICAL: Supabase service key not configured. User auth record may be orphaned.');
				return fail(500, {
					success: false, // Aunque el cliente fue borrado, la operación no fue un éxito completo.
					message:
						'Socio eliminado, pero no se pudo borrar el usuario de autenticación. Contactar a soporte.'
				});
			}
			const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, serviceKey, {
				auth: { autoRefreshToken: false, persistSession: false }
			});

			const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

			if (authError && authError.message !== 'User not found') {
				// Si el usuario no se encuentra, no es un error fatal en este punto,
				// podría haber estado inconsistente desde antes.
				// Pero si hay otro error, es importante saberlo.
				console.error(`Error deleting auth user ${userId}:`, authError);
				return fail(500, {
					success: false,
					message: `Socio eliminado, pero hubo un error al limpiar el usuario de autenticación: ${authError.message}`
				});
			}
		}

		return { success: true, message: 'Socio eliminado con éxito.' };
	},

	updateSocio: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const birthDate = formData.get('birth_date') as string;

		const socioData: { [key: string]: any } = {
			name: formData.get('name') as string,
			ci: formData.get('ci') as string,
			phone: formData.get('phone') as string,
			birth_date: birthDate || null,
			membership_type: formData.get('membership_type') as string,
			emergency_contact_name: formData.get('emergency_contact_name') as string,
			emergency_contact_phone: formData.get('emergency_contact_phone') as string,
			status: formData.get('status') as string,
			illnesses: formData.get('illnesses') as string,
			comments: formData.get('comments') as string
		};

		const photoFile = formData.get('photo') as File;
		if (photoFile && photoFile.size > 0) {
			// Need the user_id for the file path, let's fetch it first
			const { data: client, error: clientError } = await supabase
				.from('clients')
				.select('user_id')
				.eq('id', id)
				.single();

			if (clientError || !client) {
				console.error('Error fetching client user_id for photo upload:', clientError);
				return fail(500, { success: false, message: 'No se pudo encontrar el socio para la foto.' });
			}

			const fileName = `${client.user_id}/${Date.now()}_${photoFile.name}`;
			const { data: uploadData, error: uploadError } = await supabase.storage
				.from('avatars')
				.upload(fileName, photoFile);

			if (uploadError) {
				console.error('Upload error:', uploadError);
				return fail(500, { success: false, message: 'Error al subir la foto.' });
			}

			const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(uploadData.path);
			socioData.photo_url = publicUrlData.publicUrl;
		}

		const { error } = await supabase.from('clients').update(socioData).eq('id', id);

		if (error) {
			console.error('Error updating socio:', error);
			return fail(500, {
				success: false,
				message: `Error al actualizar los datos del socio: ${error.message}`
			});
		}

		return { success: true, message: 'Socio actualizado con éxito.' };
	}
}; 
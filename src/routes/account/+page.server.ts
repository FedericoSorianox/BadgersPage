import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { AuthApiError } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		redirect(303, '/login');
	}

	return { session };
};

export const actions: Actions = {
	updatePassword: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (!session) {
			redirect(303, '/login');
		}

		const formData = await request.formData();
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!password) {
			return fail(400, {
				message: 'La contraseña no puede estar vacía.',
				error: 'password'
			});
		}

		if (password !== confirmPassword) {
			return fail(400, {
				message: 'Las contraseñas no coinciden.',
				error: 'confirmPassword'
			});
		}

		if (password.length < 6) {
			return fail(400, {
				message: 'La contraseña debe tener al menos 6 caracteres.',
				error: 'password'
			});
		}

		const { error } = await supabase.auth.updateUser({ password });

		if (error) {
			if (error instanceof AuthApiError && error.status >= 400 && error.status < 500) {
				return fail(error.status, {
					message: 'Error al actualizar la contraseña: ' + error.message,
					error: 'api'
				});
			}
			return fail(500, {
				message: 'Error interno del servidor. Inténtalo de nuevo más tarde.',
				error: 'server'
			});
		}

		return {
			message: '¡Contraseña actualizada con éxito!'
		};
	}
}; 
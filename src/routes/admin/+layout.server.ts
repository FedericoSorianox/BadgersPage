import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, session } }) => {
	// 1. Proteger ruta: si no hay sesión, redirigir a login
	if (!session) {
		console.log('No hay sesión. Redirigiendo a login.');
		throw redirect(303, '/login');
	}

	// 2. Obtener perfil del usuario desde 'clients'
	const { data: client, error } = await supabase
		.from('clients')
		.select('role')
		.eq('user_id', session.user.id)
		.single();

	// Debug: mostrar el user_id buscado y el resultado
	console.log('Buscando perfil para user_id:', session.user.id);
	console.log('Perfil encontrado en "clients":', client);
	if (error) console.log('Error de Supabase:', error.message);

	// 3. Si no es admin, redirigir a home
	if (!client || client.role !== 'admin') {
		console.log('Acceso denegado. Rol no es "admin" o perfil no existe en "clients".');
		throw redirect(303, '/');
	}

	// 4. Devolver sesión y perfil para mostrar en el layout
	return { session, profile: client };
};
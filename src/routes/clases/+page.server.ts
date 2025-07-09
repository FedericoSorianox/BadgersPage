import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();
	let isAdmin = false;

	if (session) {
		const { data: profile } = await supabase
			.from('clients')
			.select('role')
			.eq('user_id', session.user.id)
			.single();
		if (profile?.role === 'admin') {
			isAdmin = true;
		}
	}

	const { data: disciplines, error: disciplinesError } = await supabase
		.from('disciplines')
		.select('*');

	const { data: schedule, error: scheduleError } = await supabase
		.from('schedule')
		.select('*')
		.order('time_slot');

	const { data: events, error: eventsError } = await supabase
		.from('events')
		.select('*')
		.order('event_date');

	if (disciplinesError || scheduleError || eventsError) {
		console.error('Error fetching data:', disciplinesError || scheduleError || eventsError);
	}

	return {
		disciplines: disciplines ?? [],
		schedule: schedule ?? [],
		events: events ?? [],
		isAdmin
	};
};

export const actions: Actions = {
	updateDiscipline: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const imageFile = formData.get('image') as File;

		let imageUrl = formData.get('current_image_url') as string;

		if (imageFile && imageFile.size > 0) {
			const bucket = 'gallery';
			const filePath = `disciplines/${id}-${Date.now()}`;

			const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, imageFile);

			if (uploadError) {
				return fail(500, { success: false, message: 'Error al subir la imagen.' });
			}

			const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
			imageUrl = urlData.publicUrl;

			const oldImageUrl = formData.get('current_image_url') as string;
			if (oldImageUrl && !oldImageUrl.startsWith('https://via.placeholder.com')) {
				const oldImageKey = oldImageUrl.split(`${bucket}/`)[1];
				if (oldImageKey) {
					await supabase.storage.from(bucket).remove([oldImageKey]);
				}
			}
		}

		const { error: dbError } = await supabase
			.from('disciplines')
			.update({ name, description, image_url: imageUrl })
			.eq('id', id);

		if (dbError) {
			return fail(500, {
				success: false,
				message: `Error al actualizar la disciplina: ${dbError.message}`
			});
		}

		return { success: true, message: 'Disciplina actualizada con éxito.' };
	},

	updateSchedule: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const scheduleData = JSON.parse(formData.get('scheduleData') as string);

		if (!scheduleData || !Array.isArray(scheduleData)) {
			return fail(400, { success: false, message: 'Datos del horario no válidos.' });
		}

		const { error } = await supabase.from('schedule').upsert(scheduleData);

		if (error) {
			return fail(500, {
				success: false,
				message: `Error al actualizar el horario: ${error.message}`
			});
		}

		return { success: true, message: 'Horario guardado con éxito.' };
	},

	saveEvent: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const title = formData.get('title') as string;
		const event_date = formData.get('event_date') as string;
		const description = formData.get('description') as string;
		const imageFile = formData.get('image') as File;

		if (!title || !event_date) {
			return fail(400, { success: false, message: 'El título y la fecha son obligatorios.' });
		}

		let imageUrl = formData.get('current_image_url') as string;

		if (imageFile && imageFile.size > 0) {
			const bucket = 'gallery';
			const filePath = `events/${id || 'new'}-${Date.now()}`;
			const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, imageFile);

			if (uploadError) {
				return fail(500, { success: false, message: 'Error al subir la imagen del evento.' });
			}

			const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
			imageUrl = urlData.publicUrl;

			// Borrar imagen anterior si existe
			const oldImageUrl = formData.get('current_image_url') as string;
			if (oldImageUrl) {
				const oldImageKey = oldImageUrl.split(`${bucket}/`)[1];
				if (oldImageKey) {
					await supabase.storage.from(bucket).remove([oldImageKey]);
				}
			}
		}

		const eventData = { title, event_date, description, image_url: imageUrl };

		let error;
		if (id) {
			// Actualizar evento existente
			({ error } = await supabase.from('events').update(eventData).eq('id', id));
		} else {
			// Crear nuevo evento
			({ error } = await supabase.from('events').insert(eventData));
		}

		if (error) {
			return fail(500, {
				success: false,
				message: `Error al guardar el evento: ${error.message}`
			});
		}

		return { success: true, message: 'Evento guardado con éxito.' };
	},

	deleteEvent: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { success: false, message: 'ID de evento no proporcionado.' });
		}

		// Primero, obtener la URL de la imagen para borrarla del storage
		const { data: eventData, error: fetchError } = await supabase
			.from('events')
			.select('image_url')
			.eq('id', id)
			.single();

		if (fetchError && fetchError.code !== 'PGRST116') {
			// PGRST116: 'exact one row not found' - no es un error si el evento ya fue borrado
			return fail(500, { success: false, message: 'Error al buscar el evento para eliminar.' });
		}

		// Borrar el registro de la base de datos
		const { error: deleteDbError } = await supabase.from('events').delete().eq('id', id);

		if (deleteDbError) {
			return fail(500, {
				success: false,
				message: `Error al eliminar el evento de la base de datos: ${deleteDbError.message}`
			});
		}

		// Si el borrado de la DB fue exitoso y había una imagen, borrarla del storage
		if (eventData?.image_url) {
			const bucket = 'gallery';
			const imageKey = eventData.image_url.split(`${bucket}/`)[1];
			if (imageKey) {
				await supabase.storage.from(bucket).remove([imageKey]);
			}
		}

		return { success: true, message: 'Evento eliminado con éxito.' };
	}
}; 
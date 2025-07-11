import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase, session } }) => {
	const fetchDisciplines = async () => {
		const { data, error: disciplinesError } = await supabase.from('disciplines').select('*');
		if (disciplinesError) {
			console.error('Error fetching disciplines:', disciplinesError);
			return [];
		}
		return data;
	};

	const fetchSchedule = async () => {
		const { data, error: scheduleError } = await supabase
			.from('schedule')
			.select('*')
			.order('time_slot', { ascending: true });
		if (scheduleError) {
			console.error('Error fetching schedule:', scheduleError);
			return [];
		}
		return data;
	};

	const fetchEvents = async () => {
		const { data, error: eventsError } = await supabase
			.from('events')
			.select('*')
			.order('event_date', { ascending: false });
		if (eventsError) {
			console.error('Error fetching events:', eventsError);
			return [];
		}
		return data;
	};

	let isAdmin = false;
	if (session) {
		const { data: profile } = await supabase
			.from('clients')
			.select('role')
			.eq('user_id', session.user.id)
			.single();
		isAdmin = profile?.role === 'admin';
	}

	const [disciplines, schedule, events] = await Promise.all([
		fetchDisciplines(),
		fetchSchedule(),
		fetchEvents()
	]);

	return {
		disciplines,
		schedule,
		events,
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
				console.error('Error uploading discipline image:', uploadError);
				return fail(500, {
					success: false,
					message: `Error al subir la imagen: ${uploadError.message}`
				});
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

	createDiscipline: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;
		const imageFile = formData.get('image') as File;

		if (!name) {
			return fail(400, { success: false, message: 'El nombre es obligatorio.' });
		}

		let imageUrl: string | null = null;
		const newDisciplineId = crypto.randomUUID();

		if (imageFile && imageFile.size > 0) {
			const bucket = 'gallery';
			const filePath = `disciplines/${newDisciplineId}-${Date.now()}`;
			const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, imageFile);

			if (uploadError) {
				console.error('Error uploading new discipline image:', uploadError);
				return fail(500, {
					success: false,
					message: `Error al subir la imagen: ${uploadError.message}`
				});
			}
			const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
			imageUrl = urlData.publicUrl;
		}

		const { error: dbError } = await supabase
			.from('disciplines')
			.insert({ id: newDisciplineId, name, description, image_url: imageUrl });

		if (dbError) {
			return fail(500, {
				success: false,
				message: `Error al crear la disciplina: ${dbError.message}`
			});
		}

		return {
			success: true,
			message: 'Disciplina creada con éxito.'
		};
	},

	deleteDiscipline: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { success: false, message: 'ID de disciplina no proporcionado.' });
		}

		// Obtener la URL de la imagen para borrarla del storage
		const { data: disciplineData, error: fetchError } = await supabase
			.from('disciplines')
			.select('image_url')
			.eq('id', id)
			.single();

		if (fetchError && fetchError.code !== 'PGRST116') {
			return fail(500, {
				success: false,
				message: 'Error al buscar la disciplina para eliminar.'
			});
		}

		// Borrar de la DB
		const { error: deleteDbError } = await supabase.from('disciplines').delete().eq('id', id);

		if (deleteDbError) {
			return fail(500, {
				success: false,
				message: `Error al eliminar la disciplina: ${deleteDbError.message}`
			});
		}

		// Borrar imagen del storage
		if (disciplineData?.image_url) {
			const bucket = 'gallery';
			const imageKey = disciplineData.image_url.split(`${bucket}/`)[1];
			if (imageKey) {
				await supabase.storage.from(bucket).remove([imageKey]);
			}
		}

		return { success: true, message: 'Disciplina eliminada con éxito.' };
	},

	updateSchedule: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const rawScheduleData = JSON.parse(formData.get('scheduleData') as string);

		if (!rawScheduleData || !Array.isArray(rawScheduleData)) {
			return fail(400, { success: false, message: 'Datos del horario no válidos.' });
		}

		// Filtramos los datos para que upsert funcione correctamente con las nuevas filas
		const scheduleData = rawScheduleData.map((row: any) => {
			if (row.isNew) {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { id, isNew, ...newRow } = row;
				return newRow; // Devolvemos la fila sin el id temporal y el flag
			}
			// Para las filas existentes, nos aseguramos de no enviar el flag
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { isNew, ...existingRow } = row;
			return existingRow;
		});

		console.log('Datos que se enviarán a Supabase (upsert):', JSON.stringify(scheduleData, null, 2));
		const { error } = await supabase.from('schedule').upsert(scheduleData);

		if (error) {
			console.error('Error updating schedule:', error);
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
				console.error('Error uploading event image:', uploadError);
				return fail(500, {
					success: false,
					message: `Error al subir la imagen del evento: ${uploadError.message}`
				});
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
	},

	updateClasesBackground: async ({ request, locals: { supabase, session } }) => {
		if (!session) {
			throw error(401, 'Unauthorized');
		}

		const { data: profile } = await supabase
			.from('clients')
			.select('role')
			.eq('user_id', session.user.id)
			.single();

		if (profile?.role !== 'admin') {
			throw error(403, 'Forbidden');
		}

		const formData = await request.formData();
		const imageFile = formData.get('background_image') as File;

		if (!imageFile || imageFile.size === 0) {
			return fail(400, { message: 'No image file provided.' });
		}

		const filePath = `public/backgrounds/clases-bg-${Date.now()}`;
		const { error: uploadError } = await supabase.storage.from('gallery').upload(filePath, imageFile);

		if (uploadError) {
			console.error('Error uploading background image:', uploadError);
			return fail(500, { message: 'Failed to upload image.' });
		}

		const {
			data: { publicUrl }
		} = supabase.storage.from('gallery').getPublicUrl(filePath);

		const { error: dbError } = await supabase
			.from('site_settings')
			.update({ value: publicUrl })
			.eq('key', 'clases_background_url');

		if (dbError) {
			console.error('Error updating site settings:', dbError);
			return fail(500, { message: 'Failed to update background URL in database.' });
		}

		return { success: true, message: 'Background image updated successfully.' };
	}
}; 
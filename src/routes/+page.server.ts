import { error, fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	updateLandingBackground: async ({ request, locals: { supabase, session } }) => {
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

		const filePath = `public/backgrounds/landing-bg-${Date.now()}`;
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
			.eq('key', 'landing_background_url');

		if (dbError) {
			console.error('Error updating site settings:', dbError);
			return fail(500, { message: 'Failed to update background URL in database.' });
		}

		return { success: true, message: 'Background image updated successfully.' };
	}
}; 
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
	const { data: product, error } = await supabase
		.from('productos')
		.select('*')
		.eq('id', params.id)
		.single();

	if (error || !product) {
		throw redirect(303, '/admin/inventario');
	}

	let img_url = '';
	if (product.imagen) {
		const imagePath = product.imagen.startsWith('/') ? product.imagen.substring(1) : product.imagen;
		const { data: imageUrl } = supabase.storage
			.from('product-images')
			.getPublicUrl(imagePath);
		img_url = imageUrl.publicUrl;
	}

	return { product: { ...product, img_url } };
};

export const actions: Actions = {
	updateProduct: async ({ request, locals: { supabase }, params }) => {
		const formData = await request.formData();
		const nombre = formData.get('nombre') as string;
		const precio = parseFloat(formData.get('precio') as string);
		const costo = parseFloat(formData.get('cost') as string);
		const stock = parseInt(formData.get('stock') as string, 10);
		const newImageFile = formData.get('imagen') as File;

		const productData: {
			nombre: string;
			precio: number;
			cost: number;
			stock: number;
			imagen?: string;
		} = {
			nombre,
			precio,
			cost: costo,
			stock
		};

		// Si se subió una nueva imagen, la procesamos
		if (newImageFile && newImageFile.size > 0) {
			const imagePath = `${Date.now()}_${newImageFile.name}`;
			const { error: uploadError } = await supabase.storage
				.from('product-images')
				.upload(imagePath, newImageFile);

			if (uploadError) {
				return fail(500, { success: false, message: `Error al subir la imagen: ${uploadError.message}` });
			}
			productData.imagen = imagePath;
		}

		const { error: updateError } = await supabase
			.from('productos')
			.update(productData)
			.eq('id', params.id);

		if (updateError) {
			return fail(500, {
				success: false,
				message: `Error al actualizar el producto: ${updateError.message}`
			});
		}

		throw redirect(303, '/admin/inventario');
	}
}; 
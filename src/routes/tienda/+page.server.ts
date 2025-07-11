import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Tables } from '$lib/database.types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	// Cargar solo los productos que son visibles y tienen stock
	const { data: productsData, error: productsError } = await supabase
		.from('productos')
		.select('*')
		.eq('is_visible', true)
		.gt('stock', 0);

	if (productsError) {
		console.error('Error loading visible products with stock:', productsError);
		throw error(500, { message: 'Error al cargar productos' });
	}

	// Añadir la URL pública de la imagen a cada producto
	const products = (productsData || []).map((product: Tables<'productos'>) => {
		let img_url = '';
		if (product.imagen) {
			// Comprobar si 'imagen' ya es una URL completa. Si no, generarla.
			if (product.imagen.startsWith('http')) {
				img_url = product.imagen;
			} else {
				const { data: imageData } = supabase.storage
					.from('product-images')
					.getPublicUrl(product.imagen);
				img_url = imageData.publicUrl;
			}
		}
		return {
			...product,
			img_url
		};
	});

	return {
		products
	};
};
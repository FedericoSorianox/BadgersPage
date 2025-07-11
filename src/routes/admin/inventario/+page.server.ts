import { fail, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { startOfWeek, endOfWeek, subWeeks, format, eachDayOfInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '$lib/supabaseClient';

function getWeekDates(weekString: string) {
	const date = weekString ? new Date(weekString) : new Date();
	const start = startOfWeek(date, { weekStartsOn: 1 }); // Lunes
	const end = endOfWeek(date, { weekStartsOn: 1 });
	return { start, end };
}

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	// 1. Obtener todos los productos
	const { data: products, error: productsError } = await supabase.rpc('get_all_products_for_admin');

	if (products) {
		products.sort((a, b) => a.nombre.localeCompare(b.nombre));
	}

	// 2. Obtener historial de ventas
	const { data: sales, error: salesError } = await supabase
		.from('product_sales')
		.select('*, product:productos(nombre)')
		.order('sale_date', { ascending: false });

	if (productsError || salesError) {
		console.error({ productsError, salesError });
	}

	// 3. Generar lista de semanas para el selector
	const weeks = Array.from({ length: 8 }).map((_, i) => {
		const date = subWeeks(new Date(), i);
		const weekStart = startOfWeek(date, { weekStartsOn: 1 });
		return {
			value: format(weekStart, 'yyyy-MM-dd'),
			label: `Semana del ${format(weekStart, "d 'de' MMMM", { locale: es })}`
		};
	});

	const selectedWeek = url.searchParams.get('week') || weeks[0]?.value;

	const selectedWeekStart = parseISO(selectedWeek);
	const selectedWeekEnd = endOfWeek(selectedWeekStart, { weekStartsOn: 1 });
	const weekDates = eachDayOfInterval({ start: selectedWeekStart, end: selectedWeekEnd });

	// Añadir la URL pública de la imagen a cada producto de forma segura
	const productsData = (products || []).map((product) => {
		let img_url = ''; // URL vacía por defecto
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

	// Procesar datos para la tabla de stock semanal
	const weeklyStockData = (productsData || []).map((product) => {
		const dailyStock = {};
		const now = new Date();

		for (const dayDate of weekDates) {
			const endOfDay = new Date(dayDate);
			endOfDay.setHours(23, 59, 59, 999);

			// Si el día es en el futuro, el stock es el actual
			if (endOfDay > now) {
				dailyStock[format(dayDate, 'yyyy-MM-dd')] = product.stock;
				continue;
			}

			// Para días pasados o el actual, calculamos el stock histórico
			// Sumamos todas las ventas de este producto que ocurrieron DESPUÉS de este día
			const salesAfterDay = (sales || [])
				.filter((s) => s.product_id === product.id && new Date(s.sale_date) > endOfDay)
				.reduce((sum, s) => sum + s.quantity, 0);

			// El stock histórico es el stock actual + las ventas que ocurrieron después
			const historicalStock = product.stock + salesAfterDay;
			dailyStock[format(dayDate, 'yyyy-MM-dd')] = historicalStock;
		}
		return {
			...product,
			dailyStock
		};
	});

	return {
		products: productsData,
		sales: sales || [],
		weeklyStock: {
			data: weeklyStockData,
			headers: Array.from({ length: 7 }).map((_, i) =>
				new Date(selectedWeekStart).setDate(selectedWeekStart.getDate() + i)
			),
			weeks: weeks,
			selectedWeek,
			selectedWeekLabel: `Semana del ${format(selectedWeekStart, "d 'de' MMMM", { locale: es })}`
		}
	};
};

export const actions: Actions = {
	registerSale: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const productId = formData.get('productId') as string;
		const quantity = parseInt(formData.get('quantity') as string, 10);
		const saleDate = formData.get('saleDate') as string;

		if (!productId || !quantity || !saleDate) {
			return fail(400, { success: false, message: 'Faltan datos para registrar la venta.' });
		}

		// 1. Obtener el precio del producto
		const { data: product, error: productError } = await supabase
			.from('productos')
			.select('precio, stock')
			.eq('id', productId)
			.single();

		if (productError || !product) {
			return fail(404, { success: false, message: 'Producto no encontrado.' });
		}

		// 2. Verificar stock
		if (product.stock < quantity) {
			return fail(400, { success: false, message: 'No hay suficiente stock para esta venta.' });
		}

		// 3. Registrar la venta
		const { error: saleError } = await supabase.from('product_sales').insert({
			product_id: productId,
			quantity,
			sale_price: product.precio,
			sale_date: saleDate
		});

		if (saleError) {
			return fail(500, { success: false, message: `Error al registrar la venta: ${saleError.message}` });
		}

		// 4. Actualizar el stock del producto
		const newStock = product.stock - quantity;
		const { error: stockError } = await supabase
			.from('productos')
			.update({ stock: newStock })
			.eq('id', productId);

		if (stockError) {
			// La venta se registró pero el stock no se actualizó. Esto requiere atención.
			console.error('Error updating stock for product', productId);
			return fail(500, {
				success: false,
				message: 'La venta se registró, pero hubo un error al actualizar el stock.'
			});
		}

		return { success: true, message: 'Venta registrada con éxito.' };
	},

	deleteProduct: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const productId = formData.get('productId') as string;

		if (!productId) {
			return fail(400, { success: false, message: 'Falta el ID del producto.' });
		}

		// Opcional: Primero borrar la imagen del storage
		// const { data: product } = await supabase.from('productos').select('imagen').eq('id', productId).single();
		// if (product?.imagen) {
		// 	await supabase.storage.from('products').remove([product.imagen]);
		// }

		const { error } = await supabase.from('productos').delete().eq('id', productId);

		if (error) {
			return fail(500, { success: false, message: `Error al borrar el producto: ${error.message}` });
		}

		return { success: true, message: 'Producto borrado con éxito.' };
	},

	toggleVisibility: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const productId = formData.get('productId') as string;
		const isVisible = formData.get('isVisible') === 'true';

		if (!productId) {
			return fail(400, { success: false, message: 'Falta el ID del producto.' });
		}

		const { error } = await supabase.rpc('toggle_product_visibility', {
			product_id_to_update: productId,
			current_visibility: isVisible
		});

		if (error) {
			return fail(500, {
				success: false,
				message: `Error al cambiar la visibilidad: ${error.message}`
			});
		}

		return { success: true, message: 'Visibilidad cambiada con éxito.' };
	}
}; 
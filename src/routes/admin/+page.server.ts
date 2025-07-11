import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { SupabaseClient } from '@supabase/supabase-js';

export const load: PageServerLoad = async ({ locals: { supabase, session } }) => {
	if (!session) {
		throw redirect(303, '/');
	}

	const { data: userRole } = await supabase.rpc('get_user_role');

	if (userRole !== 'admin') {
		throw redirect(303, '/');
	}

	// Fetch data for the dashboard

	// --- PRODUCT STATS ---
	// Use the same RPC as the inventory page for consistency
	const { data: allProducts, error: productsError } = await supabase.rpc('get_all_products_for_admin');

	if (productsError) {
		console.error('Error fetching products with RPC:', productsError);
	}

	const productsInStock = allProducts?.filter((p: any) => p.stock > 0).length ?? 0;
	const lowStockProducts =
		allProducts
			?.filter((p: any) => p.stock < 10)
			.sort((a: any, b: any) => a.stock - b.stock) ?? [];


	// --- CLIENT STATS ---
	const { data: activeClientsList, error: activeClientsError } = await supabase
		.from('clients')
		.select('id, name, ci, phone, status')
		.eq('status', 'Activo')
		.neq('role', 'admin');

	const { data: inactiveClientsList, error: inactiveClientsError } = await supabase
		.from('clients')
		.select('id, name, ci, phone, status')
		.eq('status', 'Inactive')
		.neq('role', 'admin');
	
	const { data: allClients, error: clientsError } = await supabase
		.from('clients')
		.select('*')
		.order('name', { ascending: true });


	if (activeClientsError || inactiveClientsError || clientsError) {
		console.error('Error fetching client stats:', { activeClientsError, inactiveClientsError, clientsError });
	}

	const activeClientsCount = activeClientsList?.length ?? 0;

	// --- PAYMENT STATS for the current month ---
	const currentMonth = new Date().getMonth() + 1;
	const currentYear = new Date().getFullYear();

	const { data: paymentsThisMonth, error: paidThisMonthError } = await supabase
		.from('membership_payments')
		.select('client_id')
		.eq('payment_month', currentMonth)
		.eq('payment_year', currentYear);

	if (paidThisMonthError) {
		console.error('Error fetching payment stats:', paidThisMonthError);
	}

	const paidClientIds = new Set(paymentsThisMonth?.map((p) => p.client_id) ?? []);
	const paidPayments = paidClientIds.size;
	const pendingPayments = activeClientsCount - paidPayments;
	const pendingClientsList = activeClientsList?.filter((client) => !paidClientIds.has(client.id)) ?? [];

	return {
		userRole,
		stats: {
			activeClients: activeClientsCount,
			inactiveClients: inactiveClientsList?.length ?? 0,
			productsInStock: productsInStock,
			paidPayments: paidPayments,
			pendingPayments: pendingPayments
		},
		lowStockProducts: lowStockProducts,
		allProducts: allProducts ?? [],
		allClients: allClients ?? [],
		activeClientsList: activeClientsList ?? [],
		inactiveClientsList: inactiveClientsList ?? [],
		pendingClientsList
	};
};

export const actions = {
	registerPayment: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const ci = formData.get('ci') as string;
		const month = Number(formData.get('month'));
		const year = Number(formData.get('year'));
		const amount = Number(formData.get('amount'));

		if (!ci || ci === 'undefined' || !month || !year || !amount) {
			return fail(400, { message: 'Todos los campos son requeridos.' });
		}

		// Find the client by CI to get the ID
		const { data: client, error: clientError } = await supabase
			.from('clients')
			.select('id')
			.eq('ci', ci)
			.single();

		if (clientError || !client) {
			console.error('Error finding client by CI:', clientError);
			return fail(400, { message: 'Socio no encontrado.' });
		}

		const clientId = client.id;

		// Check if a payment for this client, month, and year already exists
		const { data: existingPayment, error: checkError } = await supabase
			.from('membership_payments')
			.select('id')
			.eq('client_id', clientId)
			.eq('payment_month', month)
			.eq('payment_year', year)
			.maybeSingle();

		if (checkError) {
			console.error('Error checking for existing payment:', checkError);
			return fail(500, { message: 'Error al verificar el pago.' });
		}

		if (existingPayment) {
			// Update existing payment
			const { error: updateError } = await supabase
				.from('membership_payments')
				.update({ amount })
				.eq('id', existingPayment.id);

			if (updateError) {
				console.error('Error updating payment:', updateError);
				return fail(500, { message: 'Error al actualizar el pago.' });
			}
		} else {
			// Insert new payment
			const { error: insertError } = await supabase.from('membership_payments').insert({
				client_id: clientId,
				payment_month: month,
				payment_year: year,
				amount: amount,
				payment_date: new Date()
			});

			if (insertError) {
				console.error('Error inserting payment:', insertError);
				return fail(500, { message: 'Error al registrar el pago.' });
			}
		}

		return { success: true };
	}
}; 
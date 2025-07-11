import { fail, error, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const selectedYear = Number(url.searchParams.get('year')) || new Date().getFullYear();

	const { data: clients, error: clientsError } = await supabase
		.from('clients')
		.select('id, name, ci')
		.eq('status', 'Activo')
		.order('name', { ascending: true });

	if (clientsError) {
		console.error('Error fetching clients:', clientsError);
		throw error(500, { message: 'Error al cargar los socios.' });
	}

	const { data: payments, error: paymentsError } = await supabase
		.from('membership_payments')
		.select('client_id, amount, payment_month, payment_year')
		.eq('payment_year', selectedYear);

	if (paymentsError) {
		console.error('Error fetching payments:', paymentsError);
		throw error(500, { message: 'Error al cargar los pagos.' });
	}

	if (!clients || !payments) {
		throw error(404, 'No se pudieron cargar los datos de socios o pagos.');
	}

	const paymentsByClient = clients.reduce(
		(
			acc: Record<string, ({ amount: number } | null)[]>,
			client: { id: string; name: string; ci: string }
		) => {
			acc[client.id] = Array(12).fill(null);
			const clientPayments = payments.filter(
				(p: {
					client_id: string;
					amount: number;
					payment_month: number;
					payment_year: number;
				}) => p.client_id === client.id
			);
			clientPayments.forEach(
				(p: {
					client_id: string;
					amount: number;
					payment_month: number;
					payment_year: number;
				}) => {
					if (p.payment_month >= 1 && p.payment_month <= 12) {
						acc[client.id][p.payment_month - 1] = { amount: p.amount };
					}
				}
			);
			return acc;
		},
		{} as Record<string, ({ amount: number } | null)[]>
	);

	return {
		clients,
		paymentsByClient,
		selectedYear
	};
};

export const actions: Actions = {
	deletePayment: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const clientId = formData.get('clientId') as string;
		const month = Number(formData.get('month'));
		const year = Number(formData.get('year'));

		if (!clientId || !month || !year) {
			return fail(400, { success: false, message: 'Faltan datos para realizar la operación.' });
		}

		const { error: deleteError } = await supabase
			.from('membership_payments')
			.delete()
			.eq('client_id', clientId)
			.eq('payment_month', month)
			.eq('payment_year', year);

		if (deleteError) {
			console.error('Error deleting payment:', deleteError);
			return fail(500, { success: false, message: 'Error al eliminar el pago.' });
		}
		return { success: true, message: 'Pago desmarcado.' };
	},
	registerPayment: async (event: RequestEvent) => {
		const { request, locals } = event;
		const formData = await request.formData();
		const ci = formData.get('ci') as string;
		const month = Number(formData.get('month'));
		const year = Number(formData.get('year'));
		const amount = Number(formData.get('amount'));

		if (!ci || ci === 'undefined' || !month || !year || !amount) {
			return fail(400, { message: 'Todos los campos son requeridos.' });
		}

		// Find the client by CI to get the ID
		const { data: client, error: clientError } = await locals.supabase
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
		const { data: existingPayment, error: checkError } = await locals.supabase
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
			const { error: updateError } = await locals.supabase
				.from('membership_payments')
				.update({ amount })
				.eq('id', existingPayment.id);

			if (updateError) {
				console.error('Error updating payment:', updateError);
				return fail(500, { message: 'Error al actualizar el pago.' });
			}
		} else {
			// Insert new payment
			const { error: insertError } = await locals.supabase.from('membership_payments').insert({
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
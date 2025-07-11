import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const month = parseInt(url.searchParams.get('month') || (new Date().getMonth() + 1).toString());
	const year = parseInt(url.searchParams.get('year') || new Date().getFullYear().toString());

	const startDate = new Date(year, month - 1, 1);
	const endDate = new Date(year, month, 0);

	// 1. Cargar ingresos por cuotas
	const { data: membershipData, error: membershipError } = await supabase
		.from('membership_payments')
		.select('amount')
		.eq('payment_month', month)
		.eq('payment_year', year);

	// 2. Cargar ingresos por ventas
	const { data: salesData, error: salesError } = await supabase
		.from('product_sales')
		.select('sale_price, quantity')
		.gte('sale_date', startDate.toISOString())
		.lte('sale_date', endDate.toISOString());

	// 3. Cargar gastos totales
	const { data: expensesData, error: expensesError } = await supabase
		.from('expenses')
		.select('amount')
		.gte('expense_date', startDate.toISOString())
		.lte('expense_date', endDate.toISOString());

	if (membershipError || salesError || expensesError) {
		console.error('Error loading financial data:', membershipError || salesError || expensesError);
		// Consider returning an error page
	}

	const membershipIncome =
		membershipData?.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0) || 0;
	const salesIncome =
		salesData?.reduce(
			(sum: number, s: { sale_price: number; quantity: number }) => sum + s.sale_price * s.quantity,
			0
		) || 0;
	const totalExpenses =
		expensesData?.reduce((sum: number, e: { amount: number }) => sum + e.amount, 0) || 0;
	const netProfit = membershipIncome + salesIncome - totalExpenses;

	const summary = {
		membershipIncome,
		salesIncome,
		totalExpenses,
		netProfit
	};

	// 4. Cargar historial financiero
	const { data: historyPayments } = await supabase
		.from('membership_payments')
		.select(
			`
			payment_date, 
			amount, 
			client:clients ( name )
		`
		)
		.eq('payment_month', month)
		.eq('payment_year', year);

	const { data: historySales } = await supabase
		.from('product_sales')
		.select(
			`
			sale_date, 
			sale_price, 
			quantity, 
			product:productos ( nombre )
		`
		)
		.gte('sale_date', startDate.toISOString())
		.lte('sale_date', endDate.toISOString());

	const { data: historyExpenses } = await supabase
		.from('expenses')
		.select('expense_date, amount, concept')
		.gte('expense_date', startDate.toISOString())
		.lte('expense_date', endDate.toISOString());

	const financialHistory = [
		...(historyPayments?.map((p: any) => ({
			date: p.payment_date,
			type: 'Cuota',
			concept: `Cuota de ${p.client.name}`,
			amount: p.amount
		})) || []),
		...(historySales?.map((s: any) => ({
			date: s.sale_date,
			type: 'Venta',
			concept: `${s.quantity}x ${s.product.nombre}`,
			amount: s.sale_price * s.quantity
		})) || []),
		...(historyExpenses?.map((e: any) => ({
			date: e.expense_date,
			type: 'Gasto',
			concept: e.concept,
			amount: e.amount
		})) || [])
	].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return {
		summary,
		financialHistory,
		month,
		year
	};
};

export const actions: Actions = {
	'register-expense': async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const concept = formData.get('concept') as string;
		const amount = parseFloat(formData.get('amount') as string);
		const date = formData.get('date') as string;
		const category = formData.get('category') as string;

		if (!concept || !amount || !date) {
			return fail(400, {
				success: false,
				message: 'Concepto, monto y fecha son requeridos.',
				data: { concept, amount, date, category }
			});
		}

		const { error } = await supabase.from('expenses').insert({
			concept,
			amount,
			expense_date: date,
			category
		});

		if (error) {
			return fail(500, {
				success: false,
				message: `Error al registrar el gasto: ${error.message}`,
				data: { concept, amount, date, category }
			});
		}

		return { success: true, message: 'Gasto registrado con éxito.' };
	}
}; 
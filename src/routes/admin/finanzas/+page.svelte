<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { PageData, ActionData } from './$types';
	import FinanceChart from '$lib/components/FinanceChart.svelte';
	import { goto } from '$app/navigation';
	// import { toast, SvelteToast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import * as Select from '$lib/components/ui/select';

	export let data: PageData;
	export let form: ActionData;

	type FinancialHistoryItem = {
		date: string;
		type: 'Cuota' | 'Venta' | 'Gasto';
		concept: string;
		amount: number;
	};

	let { summary, financialHistory, month, year } = data;

	$: ({ summary, financialHistory, month, year } = data);

	// --- Lógica de la calculadora ---
	const PORCENTAJE_PARA_SUELDOS = 0.6;

	// --- Inputs del usuario ---
	let gananciaBruta: number | undefined;
	let horasFede: number | undefined = 40;
	let horasGuille: number | undefined = 16;
	let horasGonza: number | undefined = 8;

	// Para controlar la visibilidad
	let showBreakdown = false;

	// --- Valores Calculados ---
	let valorHora = 0;
	let resultadoReparto = { fede: 0, guille: 0, gonza: 0 };

	function calculate() {
		const gb = Number(gananciaBruta || 0);
		const hf = Number(horasFede || 0);
		const hg = Number(horasGuille || 0);
		const hgo = Number(horasGonza || 0);

		// 1. Calcular el "Sueldos" (40% de la ganancia)
		const sueldosPool = gb * PORCENTAJE_PARA_SUELDOS;

		// 2. Calcular total de horas
		const totalHorasMensuales = hf + hg + hgo;

		// 3. Calcular valor hora
		valorHora = totalHorasMensuales > 0 ? sueldosPool / totalHorasMensuales : 0;

		// 4. Calcular reparto final
		resultadoReparto = {
			fede: hf * valorHora,
			guille: hg * valorHora,
			gonza: hgo * valorHora
		};
	}

	// --- Reactividad ---
	// Sincronizar e inicializar
	$: {
		if (gananciaBruta === undefined && summary?.netProfit !== undefined) {
			gananciaBruta = summary.netProfit;
		}
		// Recalcular siempre que cambie un input
		calculate();
	}

	function formatCurrency(value: number) {
		return new Intl.NumberFormat('es-UY', {
			style: 'currency',
			currency: 'UYU'
		}).format(value);
	}

	const months = [
		{ value: '1', label: 'Enero' },
		{ value: '2', label: 'Febrero' },
		{ value: '3', label: 'Marzo' },
		{ value: '4', label: 'Abril' },
		{ value: '5', label: 'Mayo' },
		{ value: '6', label: 'Junio' },
		{ value: '7', 'label': 'Julio' },
		{ value: '8', label: 'Agosto' },
		{ value: '9', label: 'Septiembre' },
		{ value: '10', label: 'Octubre' },
		{ value: '11', label: 'Noviembre' },
		{ value: '12', label: 'Diciembre' }
	];

	const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) =>
		y.toString()
	);

	function goToPreviousMonth() {
		let newMonth = month - 1;
		let newYear = year;
		if (newMonth < 1) {
			newMonth = 12;
			newYear--;
		}
		goto(`/admin/finanzas?month=${newMonth}&year=${newYear}`, {
			invalidateAll: true,
			noScroll: true
		});
	}

	function goToNextMonth() {
		let newMonth = month + 1;
		let newYear = year;
		if (newMonth > 12) {
			newMonth = 1;
			newYear++;
		}
		goto(`/admin/finanzas?month=${newMonth}&year=${newYear}`, {
			invalidateAll: true,
			noScroll: true
		});
	}

	$: displayDate = `${months.find((m) => m.value === month.toString())?.label} ${year}`;

	type FilterType = 'Todos' | 'Cuota' | 'Venta' | 'Gasto';
	let activeFilter: FilterType = 'Todos';

	$: filteredHistory =
		activeFilter === 'Todos'
			? financialHistory
			: financialHistory.filter((item: FinancialHistoryItem) => item.type === activeFilter);

	onMount(() => {
		// if (form?.success) {
		// 	toast.push(form.message || 'Operación exitosa');
		// } else if (form?.message) {
		// 	toast.push(form.message, { theme: { '--toastBackground': '#F44336' } });
		// }
	});
</script>

<!-- <SvelteToast /> -->

<div class="container mx-auto p-4 space-y-8">
	<h1 class="text-3xl font-bold">Finanzas</h1>

	<Card>
		<CardHeader class="flex flex-row items-center justify-between">
			<CardTitle>Resumen Financiero Mensual</CardTitle>
			<div class="flex items-center space-x-2">
				<Button on:click={goToPreviousMonth} variant="outline" size="icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-4 w-4"
					>
						<path d="m15 18-6-6 6-6" />
					</svg>
				</Button>
				<span class="font-semibold text-lg w-36 text-center">{displayDate}</span>
				<Button on:click={goToNextMonth} variant="outline" size="icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-4 w-4"
					>
						<path d="m9 18 6-6-6-6" />
					</svg>
				</Button>
			</div>
		</CardHeader>
		<CardContent>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
				<div class="p-4 bg-green-100 rounded-lg">
					<p class="text-sm text-green-800 font-semibold">Ingresos por Cuotas</p>
					<p class="text-2xl font-bold text-green-900">{formatCurrency(summary.membershipIncome)}</p>
				</div>
				<div class="p-4 bg-blue-100 rounded-lg">
					<p class="text-sm text-blue-800 font-semibold">Ingresos por Ventas</p>
					<p class="text-2xl font-bold text-blue-900">{formatCurrency(summary.salesIncome)}</p>
				</div>
				<div class="p-4 bg-red-100 rounded-lg">
					<p class="text-sm text-red-800 font-semibold">Gastos Totales</p>
					<p class="text-2xl font-bold text-red-900">{formatCurrency(summary.totalExpenses)}</p>
				</div>
				<div class="p-4 bg-gray-100 rounded-lg">
					<p class="text-sm text-gray-800 font-semibold">Resultado Neto</p>
					<p
						class="text-2xl font-bold"
						class:text-green-900={summary.netProfit >= 0}
						class:text-red-900={summary.netProfit < 0}
					>
						{formatCurrency(summary.netProfit)}
					</p>
				</div>
			</div>
		</CardContent>
	</Card>

	<!-- Main Content Area -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- Left Column: Chart -->
		<div class="lg:col-span-2">
			<Card>
				<CardHeader>
					<CardTitle>Resumen Gráfico</CardTitle>
					<CardDescription>
						Mostrando datos para: {new Date(data.year, data.month - 1).toLocaleString('es-UY', {
							month: 'long',
							year: 'numeric'
						})}
					</CardDescription>
				</CardHeader>
				<CardContent class="h-96">
					<FinanceChart
						income={data.summary.membershipIncome + data.summary.salesIncome}
						expenses={data.summary.totalExpenses}
					/>
				</CardContent>
			</Card>
		</div>

		<!-- Right Column: New Expense Form -->
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Registrar Nuevo Gasto</CardTitle>
				</CardHeader>
				<CardContent>
					<form method="POST" action="?/register-expense" class="space-y-4">
						<div>
							<Label for="concept">Concepto</Label>
							<Input id="concept" name="concept" required />
						</div>
						<div>
							<Label for="amount">Monto</Label>
							<Input id="amount" name="amount" type="number" step="0.01" required />
						</div>
						<div>
							<Label for="date">Fecha</Label>
							<Input id="date" name="date" type="date" value={new Date().toISOString().split('T')[0]} required />
						</div>
						<div>
							<Label for="category">Categoría</Label>
							<Input id="category" name="category" placeholder="Ej: Limpieza, Servicios" />
						</div>
						<Button type="submit" class="w-full">Registrar Gasto</Button>
						{#if form?.success === false}
							<p class="text-red-500">{form.message}</p>
						{/if}
						{#if form?.success === true}
							<p class="text-green-500">{form.message}</p>
						{/if}
					</form>
				</CardContent>
			</Card>
		</div>
	</div>

	<!-- Financial History -->
	<Card>
		<CardHeader>
			<CardTitle>Historial Financiero</CardTitle>
			<div class="flex space-x-2 mt-4">
				<Button
					variant={activeFilter === 'Todos' ? 'default' : 'outline'}
					on:click={() => (activeFilter = 'Todos')}>Todos</Button
				>
				<Button
					variant={activeFilter === 'Cuota' ? 'default' : 'outline'}
					on:click={() => (activeFilter = 'Cuota')}>Cuotas</Button
				>
				<Button
					variant={activeFilter === 'Venta' ? 'default' : 'outline'}
					on:click={() => (activeFilter = 'Venta')}>Ventas</Button
				>
				<Button
					variant={activeFilter === 'Gasto' ? 'default' : 'outline'}
					on:click={() => (activeFilter = 'Gasto')}>Gastos</Button
				>
			</div>
		</CardHeader>
		<CardContent>
			<div class="overflow-x-auto max-h-[500px] overflow-y-auto">
				<table class="table w-full">
					<thead>
						<tr>
							<th>Fecha</th>
							<th>Tipo</th>
							<th>Concepto</th>
							<th class="text-right">Monto</th>
							<th class="text-center">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredHistory as item (item.date + item.concept)}
							<tr>
								<td>{new Date(item.date).toLocaleDateString('es-UY')}</td>
								<td>{item.type}</td>
								<td>{item.concept}</td>
								<td class="text-right">{formatCurrency(item.amount)}</td>
								<td class="text-center">
									<Button variant="destructive" size="sm">🗑️</Button>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="5" class="text-center py-8">No hay registros para el filtro seleccionado.</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</CardContent>
	</Card>
</div> 
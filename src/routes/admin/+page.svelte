<script lang="ts">
	import type { PageData } from './$types';
	import { derived } from 'svelte/store';
	import { redirect } from '@sveltejs/kit';
	import type { PageServerLoad } from './$types';
	import { Bar, Doughnut } from 'svelte-chartjs';
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	import {
		Users,
		UserX,
		Archive,
		CreditCard,
		TrendingDown,
		AlertTriangle
	} from 'lucide-svelte';

	export let data: PageServerLoad;
	$: ({ stats, lowStockProducts, allProducts, allClients, inactiveClientsList, pendingClientsList, activeClientsList } = data);

	const { userRole } = data;

	let showProductsModal = false;
	let showClientsModal = false;
	let showPendingPaymentsModal = false;
	let showConfirmationModal = false;
	let selectedClientForPayment: { name: string; ci: string } | null = null;
	let clientModalFilter: 'active' | 'inactive' | 'all' = 'all';

	$: filteredClients =
		clientModalFilter === 'active'
			? activeClientsList
			: inactiveClientsList;

	function openClientModal(filter: 'active' | 'inactive') {
		clientModalFilter = filter;
		showClientsModal = true;
	}

	function getStockRowClass(stock: number): string {
		if (stock <= 3) return 'bg-red-100 text-red-800';
		if (stock <= 7) return 'bg-yellow-100 text-yellow-800';
		return 'bg-green-100 text-green-800';
	}

	function getClientStatusClass(status: string | null): string {
		if (status === 'Activo') return 'bg-green-100 text-green-800';
		return 'bg-yellow-100 text-yellow-800';
	}

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

	let paymentStatusData: any;
	$: if (stats) {
		paymentStatusData = {
			labels: ['Pagados', 'Pendientes'],
			datasets: [
				{
					data: [stats.paidPayments, stats.pendingPayments],
					backgroundColor: ['#22c55e', '#ef4444'],
					hoverBackgroundColor: ['#16a34a', '#dc2626']
				}
			]
		};
	}

	function registerCurrentMonthPayment(ci: string) {
		const form = document.getElementById('payment-form') as HTMLFormElement;
		if (form) {
			(form.elements.namedItem('ci') as HTMLInputElement).value = ci;
			(form.elements.namedItem('month') as HTMLInputElement).value = String(new Date().getMonth() + 1);
			(form.elements.namedItem('year') as HTMLInputElement).value = String(new Date().getFullYear());
			(form.elements.namedItem('amount') as HTMLInputElement).value = '2000'; // Default amount

			form.requestSubmit();
		}
	}

	function confirmPayment(client: { name: string; ci: string }) {
		selectedClientForPayment = client;
		showConfirmationModal = true;
	}

	function executePayment() {
		if (selectedClientForPayment) {
			registerCurrentMonthPayment(selectedClientForPayment.ci);
		}
		showConfirmationModal = false;
		selectedClientForPayment = null;
	}
</script>

<!-- Product Details Modal -->
{#if showProductsModal}
	<div
		class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
		on:click={() => (showProductsModal = false)}
	>
		<div class="bg-white rounded-lg shadow-2xl p-6 md:p-8 w-11/12 max-w-4xl" on:click|stopPropagation>
			<div class="flex justify-between items-center mb-6">
				<h2 class="text-2xl font-bold text-gray-800">Listado de Productos en Inventario</h2>
				<button
					class="text-gray-500 hover:text-gray-800"
					on:click={() => (showProductsModal = false)}
				>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="max-h-[70vh] overflow-y-auto">
				<table class="min-w-full bg-white">
					<thead class="bg-gray-100 sticky top-0">
						<tr>
							<th class="text-left py-3 px-4 uppercase font-semibold text-sm">Producto</th>
							<th class="text-right py-3 px-4 uppercase font-semibold text-sm">Stock</th>
							<th class="text-right py-3 px-4 uppercase font-semibold text-sm">Precio</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each allProducts as product (product.id)}
							<tr class={getStockRowClass(product.stock)}>
								<td class="py-3 px-4">{product.nombre}</td>
								<td class="text-right py-3 px-4 font-bold">{product.stock}</td>
								<td class="text-right py-3 px-4 font-mono">${product.precio.toFixed(2)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}

<!-- Pending Payments Modal -->
{#if showPendingPaymentsModal}
	<div
		class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
		on:click={() => (showPendingPaymentsModal = false)}
	>
		<div class="bg-white rounded-lg shadow-2xl p-6 md:p-8 w-11/12 max-w-lg" on:click|stopPropagation>
			<div class="flex justify-between items-center mb-6">
				<h2 class="text-2xl font-bold text-gray-800">Socios con Pagos Pendientes</h2>
				<button class="text-gray-500 hover:text-gray-800" on:click={() => (showPendingPaymentsModal = false)}>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>
			<div class="max-h-[70vh] overflow-y-auto">
				<ul class="divide-y divide-gray-200">
					{#each pendingClientsList as client (client.id)}
						<li class="py-3 px-2 flex justify-between items-center">
							<span>{client.name}</span>
							<button
								class="bg-green-500 text-white text-xs font-bold py-1 px-2 rounded hover:bg-green-600 transition-colors"
								on:click={() => confirmPayment(client)}
							>
								Registrar Pago
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
{/if}

<!-- Confirmation Modal -->
{#if showConfirmationModal && selectedClientForPayment}
	<div
		class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
		on:click={() => (showConfirmationModal = false)}
	>
		<div
			class="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm mx-auto"
			on:click|stopPropagation
		>
			<h3 class="text-lg font-bold text-gray-900 mb-4">Confirmar Pago</h3>
			<p class="text-gray-600 mb-6">
				¿Estás seguro de que quieres registrar el pago para
				<span class="font-semibold">{selectedClientForPayment.name}</span>?
			</p>
			<div class="flex justify-end space-x-3">
				<button
					class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
					on:click={() => (showConfirmationModal = false)}>Cancelar</button
				>
				<button
					class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
					on:click={executePayment}>Confirmar</button
				>
			</div>
		</div>
	</div>
{/if}

<!-- Client Details Modal -->
{#if showClientsModal}
	<div
		class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
		on:click={() => (showClientsModal = false)}
	>
		<div class="bg-white rounded-lg shadow-2xl p-6 md:p-8 w-11/12 max-w-5xl" on:click|stopPropagation>
			<div class="flex justify-between items-center mb-6">
				<h2 class="text-2xl font-bold text-gray-800">
					Listado de Socios {clientModalFilter === 'active' ? 'Activos' : 'Inactivos'}
				</h2>
				<button class="text-gray-500 hover:text-gray-800" on:click={() => (showClientsModal = false)}>
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
				</button>
			</div>
			<div class="max-h-[70vh] overflow-y-auto">
				<table class="min-w-full bg-white">
					<thead class="bg-gray-100 sticky top-0">
						<tr>
							<th class="text-left py-3 px-4 uppercase font-semibold text-sm">Nombre</th>
							<th class="text-left py-3 px-4 uppercase font-semibold text-sm">CI</th>
							<th class="text-left py-3 px-4 uppercase font-semibold text-sm">Celular</th>
							<th class="text-center py-3 px-4 uppercase font-semibold text-sm">Estado</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200">
						{#each filteredClients as client (client.id)}
							<tr>
								<td class="py-3 px-4">{client.name}</td>
								<td class="py-3 px-4">{client.ci}</td>
								<td class="py-3 px-4">{client.phone}</td>
								<td class="py-3 px-4 text-center">
									<span class="px-3 py-1 rounded-full text-xs font-semibold {getClientStatusClass(client.status)}">
										{client.status}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}

<div class="container mx-auto p-4 md:p-8">
	<h1 class="text-3xl font-bold mb-6 text-center text-gray-700">Dashboard Principal</h1>

	<!-- Stat Cards -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
		<!-- Socios Activos (Clickable) -->
		<div
			class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all"
			on:click={() => openClientModal('active')}
		>
			<div class="bg-blue-500 text-white rounded-full p-3 mb-4">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.001 3.001 0 015.658 0M12 6V3m0 3c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" /></svg>
			</div>
			<h2 class="text-sm font-semibold text-gray-500 uppercase">Socios Activos</h2>
			<p class="text-4xl font-bold mt-2">{stats.activeClients}</p>
			<p class="text-xs text-gray-400 mt-1">(Excluyendo socios sin pago mensual)</p>
		</div>

		<!-- Socios Inactivos (Clickable) -->
		<div
			class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all"
			on:click={() => openClientModal('inactive')}
		>
			<div class="bg-red-500 text-white rounded-full p-3 mb-4">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
			</div>
			<h2 class="text-sm font-semibold text-gray-500 uppercase">Socios Inactivos</h2>
			<p class="text-4xl font-bold mt-2">{stats.inactiveClients}</p>
			<p class="text-xs text-gray-400 mt-1">(Vacaciones o ausencia temporal)</p>
		</div>

		<!-- Productos en Inventario (Clickable) -->
		<div
			class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all"
			on:click={() => (showProductsModal = true)}
		>
			<div class="bg-green-500 text-white rounded-full p-3 mb-4">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
			</div>
			<h2 class="text-sm font-semibold text-gray-500 uppercase">Productos en Inventario</h2>
			<p class="text-4xl font-bold mt-2">{stats.productsInStock}</p>
			<p class="text-xs text-gray-400 mt-1">(Con stock disponible)</p>
		</div>

		<!-- Estado de Pagos -->
		<div
			class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all"
			on:click={() => (showPendingPaymentsModal = true)}
		>
			<div class="bg-yellow-500 text-white rounded-full p-3 mb-4">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
			</div>
			<h2 class="text-sm font-semibold text-gray-500 uppercase">Estado de Pagos</h2>
			<div class="flex items-center space-x-4 mt-2">
				<p class="text-4xl font-bold text-green-600">{stats.paidPayments}</p>
				<p class="text-4xl font-bold text-red-600">{stats.pendingPayments}</p>
			</div>
			<p class="text-xs text-gray-400 mt-1">Pagados / Pendientes</p>
		</div>
	</div>

	<!-- Bottom Section -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- Placeholder for Payment Status Chart -->
		<div class="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
			<div class="p-6">
				<div class="flex items-center justify-between">
					<h3 class="font-semibold">Estado de Pagos del Mes</h3>
				</div>
				<div class="mt-4 h-64 flex items-center justify-center">
					{#if stats.paidPayments > 0 || stats.pendingPayments > 0}
						<Doughnut data={paymentStatusData} />
					{:else}
						<p class="text-gray-500">No hay datos de pagos para el mes actual.</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Stock de Productos (Corrected) -->
		<div class="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
			<h2 class="text-xl font-bold mb-4 text-center">Stock de Productos</h2>
			<div class="overflow-y-auto h-64">
				<table class="min-w-full bg-white">
					<thead class="bg-gray-100 sticky top-0">
						<tr>
							<th class="text-left py-3 px-4 uppercase font-semibold text-sm">Producto</th>
							<th class="text-right py-3 px-4 uppercase font-semibold text-sm">Stock</th>
						</tr>
					</thead>
					<tbody>
						{#each lowStockProducts as product (product.id)}
							<tr class="border-b {getStockRowClass(product.stock)}">
								<td class="text-left py-3 px-4">{product.nombre}</td>
								<td class="text-right py-3 px-4 font-bold">{product.stock}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="flex justify-end space-x-4 mt-4 text-xs">
				<span class="flex items-center"><div class="w-3 h-3 rounded-full bg-red-200 mr-2"></div>Stock crítico (≤ 3)</span>
				<span class="flex items-center"><div class="w-3 h-3 rounded-full bg-yellow-200 mr-2"></div>Stock bajo (≤ 7)</span>
				<span class="flex items-center"><div class="w-3 h-3 rounded-full bg-green-200 mr-2"></div>Stock normal (> 7)</span>
			</div>
		</div>
	</div>
</div>

<form
	method="POST"
	action="?/registerPayment"
	id="payment-form"
	class="hidden"
	use:enhance={() => {
		return async ({ update }) => {
			invalidateAll();
			await update();
		};
	}}
>
	<input type="hidden" name="ci" />
	<input type="hidden" name="month" />
	<input type="hidden" name="year" />
	<input type="hidden" name="amount" />
</form>
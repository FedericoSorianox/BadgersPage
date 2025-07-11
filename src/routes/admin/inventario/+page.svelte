<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { toast, SvelteToast } from '@zerodevx/svelte-toast';
	import { goto } from '$app/navigation';
	import { format, parseISO, subDays, addDays } from 'date-fns';
	import { formatCurrency } from '$lib/utils';
	import * as Select from '$lib/components/ui/select';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	export let data: PageData;
	export let form: ActionData;

	let activeTab: 'productos' | 'ventas' | 'stock' = 'productos';
	let saleDate = new Date().toISOString().split('T')[0]; // Default to today

	function formatDate(dateString: string) {
		const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateString).toLocaleDateString('es-ES', options);
	}

	function formatDayHeader(timestamp: number) {
		const date = new Date(timestamp);
		const day = date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase().replace('.', '');
		const dateNum = date.getDate();
		return `${day}, ${dateNum}`;
	}

	onMount(() => {
		if (form?.success) {
			toast.push(form.message || 'Operación exitosa');
		} else if (form?.message) {
			toast.push(form.message, { theme: { '--toastBackground': '#F44336' } });
		}
	});

	function goToPreviousWeek() {
		const currentWeekStart = parseISO(data.weeklyStock.selectedWeek);
		const prevWeekStart = subDays(currentWeekStart, 7);
		const newWeek = format(prevWeekStart, 'yyyy-MM-dd');
		goto(`/admin/inventario?week=${newWeek}`, { invalidateAll: true, noScroll: true });
	}

	function goToNextWeek() {
		const currentWeekStart = parseISO(data.weeklyStock.selectedWeek);
		const nextWeekStart = addDays(currentWeekStart, 7);
		const newWeek = format(nextWeekStart, 'yyyy-MM-dd');
		goto(`/admin/inventario?week=${newWeek}`, { invalidateAll: true, noScroll: true });
	}
</script>

<SvelteToast />

<div class="container mx-auto p-4 space-y-6">
	<h1 class="text-3xl font-bold">Gestión de Inventario</h1>

	<!-- Tabs -->
	<div class="my-4">
		<nav class="flex justify-center space-x-4" aria-label="Tabs">
			<button
				class="py-2 px-4 font-medium text-sm rounded-md transition-colors {activeTab ===
				'productos'
					? 'bg-blue-500 text-white'
					: 'text-gray-600 hover:bg-gray-200'}"
				on:click={() => (activeTab = 'productos')}>Productos</button
			>
			<button
				class="py-2 px-4 font-medium text-sm rounded-md transition-colors {activeTab === 'ventas'
					? 'bg-blue-500 text-white'
					: 'text-gray-600 hover:bg-gray-200'}"
				on:click={() => (activeTab = 'ventas')}>Ventas</button
			>
			<button
				class="py-2 px-4 font-medium text-sm rounded-md transition-colors {activeTab === 'stock'
					? 'bg-blue-500 text-white'
					: 'text-gray-600 hover:bg-gray-200'}"
				on:click={() => (activeTab = 'stock')}>Stock Semanal</button
			>
		</nav>
	</div>

	<!-- Content based on active tab -->
	{#if activeTab === 'productos'}
		<div class="space-y-4">
			<div class="flex justify-between items-center">
				<h2 class="text-2xl font-semibold">Lista de Productos</h2>
				<a href="/admin/products/new" class="btn btn-primary">+ Agregar Producto</a>
			</div>
			<div class="overflow-x-auto bg-white p-4 rounded-lg shadow">
				<table class="table w-full">
					<thead>
						<tr>
							<th>FOTO</th>
							<th>NOMBRE</th>
							<th>PRECIO COSTO</th>
							<th>PRECIO VENTA</th>
							<th>STOCK</th>
							<th>GANANCIA</th>
							<th>VISIBLE</th>
							<th>ACCIONES</th>
						</tr>
					</thead>
					<tbody>
						{#each data.products as product (product.id)}
							<tr>
								<td>
									<div class="avatar">
										<div class="w-12 rounded">
											<img src={product.img_url} alt={product.nombre} />
										</div>
									</div>
								</td>
								<td>{product.nombre}</td>
								<td>{formatCurrency(product.costo)}</td>
								<td>{formatCurrency(product.precio)}</td>
								<td>{product.stock}</td>
								<td class="font-bold text-green-600">
									{formatCurrency(product.precio - (product.costo ?? 0))}
								</td>
								<td>
									<form
										method="POST"
										action="?/toggleVisibility"
										use:enhance
										class="flex justify-center"
									>
										<input type="hidden" name="productId" value={product.id} />
										<input type="hidden" name="isVisible" value={product.is_visible} />
										<input
											type="checkbox"
											class="toggle toggle-success"
											checked={product.is_visible}
											on:change={(e) => e.currentTarget.form?.requestSubmit()}
										/>
									</form>
								</td>
								<td>
									<div class="flex space-x-2">
										<a href="/admin/products/{product.id}" class="btn btn-sm btn-outline">✏️</a>
										<form
											method="POST"
											action="?/deleteProduct"
											use:enhance={({ cancel }) => {
												if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
													cancel();
												}
											}}
										>
											<input type="hidden" name="productId" value={product.id} />
											<button type="submit" class="btn btn-sm btn-outline btn-error">🗑️</button>
										</form>
									</div>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="7" class="text-center py-8">No hay productos para mostrar.</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{:else if activeTab === 'ventas'}
		<div class="space-y-8">
			<!-- Registrar Nueva Venta -->
			<Card>
				<CardHeader>
					<CardTitle>Registrar Nueva Venta</CardTitle>
				</CardHeader>
				<CardContent>
					<form
						method="POST"
						action="?/registerSale"
						use:enhance
						class="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
					>
						<div class="form-control md:col-span-2">
							<Label for="product">Producto</Label>
							<Select.Root name="productId">
								<Select.Trigger id="product">
									<Select.Value placeholder="Seleccionar producto..." />
								</Select.Trigger>
								<Select.Content>
									{#each data.products as product}
										<Select.Item value={product.id}>{product.nombre}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
						<div class="form-control">
							<Label for="quantity">Cantidad</Label>
							<Input
								type="number"
								name="quantity"
								id="quantity"
								value="1"
								min="1"
								required
							/>
						</div>
						<div class="form-control">
							<Label for="saleDate">Fecha de Venta</Label>
							<Input type="date" name="saleDate" id="saleDate" bind:value={saleDate} required />
						</div>
						<Button type="submit" class="w-full md:w-auto">Registrar Venta</Button>
					</form>
				</CardContent>
			</Card>

			<!-- Historial de Ventas -->
			<div class="bg-white p-4 rounded-lg shadow-md">
				<h2 class="text-2xl font-semibold mb-4">Historial de Ventas</h2>
				<div class="overflow-x-auto">
					<table class="table w-full">
						<thead>
							<tr>
								<th>PRODUCTO</th>
								<th>CANTIDAD</th>
								<th>TOTAL</th>
								<th>FECHA</th>
								<th>ACCIONES</th>
							</tr>
						</thead>
						<tbody>
							{#each data.sales as sale (sale.id)}
								<tr>
									<td>{sale.product.nombre}</td>
									<td>{sale.quantity}</td>
									<td>{formatCurrency(sale.quantity * sale.sale_price)}</td>
									<td>{formatDate(sale.sale_date)}</td>
									<td>
										<button class="btn btn-sm btn-outline btn-error">🗑️</button>
									</td>
								</tr>
							{:else}
								<tr>
									<td colspan="5" class="text-center py-8">No hay ventas registradas.</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	{:else if activeTab === 'stock'}
		<Card>
			<CardHeader>
				<CardTitle>Stock Semanal</CardTitle>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="flex items-center space-x-2">
					<Button on:click={goToPreviousWeek} variant="outline" size="icon">
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
					<span class="font-semibold text-lg w-48 text-center">
						{data.weeklyStock.selectedWeekLabel}
					</span>
					<Button on:click={goToNextWeek} variant="outline" size="icon">
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

				<div class="overflow-x-auto rounded-lg border">
					<table class="w-full text-sm text-left text-gray-500">
						<thead class="text-xs text-gray-700 uppercase bg-gray-50">
							<tr>
								<th scope="col" class="px-6 py-3 sticky left-0 bg-gray-50 z-10"> Producto </th>
								{#each data.weeklyStock.headers as dayTimestamp}
									<th scope="col" class="px-6 py-3 text-center">
										{formatDayHeader(dayTimestamp)}
									</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each data.weeklyStock.data as product}
								<tr class="bg-white border-b">
									<th
										scope="row"
										class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap sticky left-0 bg-white z-10"
									>
										{product.nombre}
									</th>
									{#each Object.entries(product.dailyStock) as [day, stock]}
										<td class="px-6 py-4 text-center">{stock}</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	{/if}
</div> 
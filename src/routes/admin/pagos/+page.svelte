<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { goto, invalidateAll } from '$app/navigation';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	// import { CheckCircle, XCircle, Info, AlertCircle, Minus } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';

	export let data: PageData;
	export let form: ActionData;

	let tableContainer: HTMLDivElement;

	onMount(() => {
		const currentMonth = new Date().getMonth();
		const currentYear = new Date().getFullYear();
		if (tableContainer && data.selectedYear === currentYear) {
			const currentMonthHeader = tableContainer.querySelector<HTMLElement>(
				`thead th:nth-child(${currentMonth + 2})`
			);
			if (currentMonthHeader) {
				const containerRect = tableContainer.getBoundingClientRect();
				const thRect = currentMonthHeader.getBoundingClientRect();

				const scrollLeft =
					thRect.left - containerRect.left - containerRect.width / 2 + thRect.width / 2;
				tableContainer.scrollLeft = scrollLeft;
			}
		}
	});

	const months = [
		{ value: 1, label: 'Enero' },
		{ value: 2, label: 'Febrero' },
		{ value: 3, label: 'Marzo' },
		{ value: 4, label: 'Abril' },
		{ value: 5, label: 'Mayo' },
		{ value: 6, label: 'Junio' },
		{ value: 7, label: 'Julio' },
		{ value: 8, label: 'Agosto' },
		{ value: 9, label: 'Septiembre' },
		{ value: 10, label: 'Octubre' },
		{ value: 11, label: 'Noviembre' },
		{ value: 12, label: 'Diciembre' }
	];

	const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

	function handleYearChange(e: Event) {
		const target = e.currentTarget as HTMLSelectElement;
		const year = target.value;
		goto(`/admin/pagos?year=${year}`);
	}

	async function registerPayment(clientCi: string, monthIndex: number) {
		const client = clients.find((c) => c.ci === clientCi);
		const month = months[monthIndex];
		const year = selectedYear;
		const amount = 2000; // Default amount, adjust as necessary

		if (!client) return;

		const confirmed = confirm(
			`¿Confirmar pago de $${amount} para ${client.name} correspondiente a ${month.label} de ${year}?`
		);

		if (confirmed) {
			const form = document.getElementById('register-payment-form') as HTMLFormElement;
			if (form) {
				(form.elements.namedItem('ci') as HTMLInputElement).value = clientCi;
				(form.elements.namedItem('month') as HTMLInputElement).value = String(month.value);
				(form.elements.namedItem('year') as HTMLInputElement).value = String(year);
				(form.elements.namedItem('amount') as HTMLInputElement).value = String(amount);
				form.requestSubmit();
			}
		}
	}

	async function deletePayment(clientId: string, monthIndex: number) {
		const client = clients.find((c) => c.id === clientId);
		const month = months[monthIndex];
		const year = selectedYear;

		if (!client) return;

		const confirmed = confirm(
			`¿Está seguro que desea eliminar el pago de ${client.name} para ${month.label} de ${year}?`
		);

		if (confirmed) {
			const form = document.getElementById('delete-payment-form') as HTMLFormElement;
			if (form) {
				(form.elements.namedItem('clientId') as HTMLInputElement).value = clientId;
				(form.elements.namedItem('month') as HTMLInputElement).value = String(month.value);
				(form.elements.namedItem('year') as HTMLInputElement).value = String(year);
				form.requestSubmit();
			}
		}
	}

	$: ({ clients, paymentsByClient, selectedYear } = data);
</script>

<div class="p-4 space-y-8 md:p-8">
	<h1 class="text-3xl font-bold">Gestión de Pagos</h1>

	{#if form?.message && form?.success === false}
		<div
			class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 flex items-center"
			role="alert"
		>
			<AlertCircle class="w-5 h-5 mr-3" />
			<span class="font-medium">Error:</span>
			{form.message}
		</div>
	{/if}

	<Card>
		<CardHeader class="flex flex-row items-center justify-between">
			<CardTitle>Estado de Pagos {selectedYear}</CardTitle>
			<div class="w-48">
				<select
					class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
					on:change={handleYearChange}
					value={selectedYear}
				>
					{#each years as year}
						<option value={year} selected={year === selectedYear}>{year}</option>
					{/each}
				</select>
			</div>
		</CardHeader>
		<CardContent>
			<div class="overflow-x-auto" bind:this={tableContainer}>
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th
								scope="col"
								class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sticky left-0 bg-gray-50 z-10"
							>
								Socio
							</th>
							{#each months as month}
								<th
									scope="col"
									class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
								>
									{month.label}
								</th>
							{/each}
						</tr>
					</thead>
					<tbody class="bg-white divide-y divide-gray-200">
						{#each clients as client}
							<tr>
								<td class="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10">
									<div class="text-sm font-medium text-gray-900">{client.name}</div>
								</td>
								{#each paymentsByClient[client.id] as payment, i}
									<td
										class="px-6 py-4 text-center whitespace-nowrap cursor-pointer"
										on:click={() => {
											if (payment) {
												deletePayment(client.id, i);
											} else {
												registerPayment(client.ci, i);
											}
										}}
									>
										{#if payment}
											<CheckCircle class="w-6 h-6 text-green-500 mx-auto" />
										{:else if new Date(selectedYear, i) < new Date()}
											<XCircle class="w-6 h-6 text-red-500 mx-auto" />
										{:else}
											<Info class="w-6 h-6 text-blue-500 mx-auto" />
										{/if}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</CardContent>
	</Card>
</div>

<form
	method="POST"
	action="?/registerPayment"
	id="register-payment-form"
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

<form
	method="POST"
	action="?/deletePayment"
	id="delete-payment-form"
	class="hidden"
	use:enhance={() => {
		return async ({ update }) => {
			invalidateAll();
			await update();
		};
	}}
>
	<input type="hidden" name="clientId" />
	<input type="hidden" name="month" />
	<input type="hidden" name="year" />
</form> 
<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { formatCurrency } from '$lib/utils';
	import { enhance } from '$app/forms';
	// import { toast, SvelteToast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';

	export let data: PageData;
	export let form: ActionData;

	const { product } = data;

	// Inicializar las variables para el formulario, asegurando que los valores sean numéricos
	let nombre = product.nombre;
	let precio = Number(product.precio);
	let costo = Number(product.costo);
	let stock = Number(product.stock);

	// Calcular la ganancia de forma reactiva
	$: ganancia = precio - costo;

	onMount(() => {
		// if (form?.success) {
		// 	toast.push(form.message || 'Operación exitosa');
		// } else if (form?.message) {
		// 	toast.push(form.message, { theme: { '--toastBackground': '#F44336' } });
		// }
	});
</script>

<!-- <SvelteToast /> -->

<div class="max-w-2xl mx-auto py-8 px-4">
	<Card>
		<CardHeader>
			<CardTitle>Editar Producto</CardTitle>
		</CardHeader>
		<CardContent>
			<form
				method="POST"
				action="?/updateProduct"
				class="space-y-6"
				use:enhance
				enctype="multipart/form-data"
			>
				<div class="form-control">
					<Label for="nombre">Nombre</Label>
					<Input name="nombre" id="nombre" type="text" bind:value={nombre} required />
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="form-control">
						<Label for="costo">Precio Costo</Label>
						<Input
							id="costo"
							name="cost"
							type="number"
							step="0.01"
							bind:value={product.cost}
						/>
					</div>
					<div class="form-control">
						<Label for="precio">Precio Venta</Label>
						<Input name="precio" id="precio" type="number" step="0.01" bind:value={precio} required />
					</div>
				</div>

				<div class="form-control">
					<Label for="stock">Stock</Label>
					<Input name="stock" id="stock" type="number" bind:value={stock} required />
				</div>

				<div class="form-control space-y-2">
					<Label>Imagen Actual</Label>
					<img src={product.img_url} alt="Imagen actual del producto" class="w-32 h-32 object-cover rounded-md" />
					<Label for="imagen">Subir nueva imagen (opcional)</Label>
					<Input name="imagen" id="imagen" type="file" accept="image/*" />
				</div>

				<Button type="submit" class="w-full">Actualizar Producto</Button>
			</form>

		</CardContent>
	</Card>
	<div class="text-center mt-4">
		<a href="/admin/inventario" class="link">Volver al inventario</a>
	</div>
</div> 
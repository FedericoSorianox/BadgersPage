<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { fly } from 'svelte/transition';

	export let show: boolean;
	let photoPreview: string | null = null;

	function close() {
		show = false;
	}

	function handlePhotoChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const reader = new FileReader();
			reader.onload = (event) => {
				photoPreview = event.target?.result as string;
			};
			reader.readAsDataURL(input.files[0]);
		}
	}
</script>

{#if show}
	<button
		class="fixed inset-0 bg-black bg-opacity-50 z-40 cursor-default"
		on:click={close}
		transition:fly={{ duration: 300, x: '100%' }}
		tabindex="-1"
		aria-label="Cerrar formulario"
	/>

	<div
		class="fixed top-0 right-0 h-full w-full max-w-lg bg-white z-50 shadow-lg p-6 overflow-y-auto"
		transition:fly={{ duration: 300, x: '100%' }}
	>
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-2xl font-bold">Agregar Nuevo Socio</h2>
			<Button variant="ghost" on:click={close}>✕</Button>
		</div>

		<form method="POST" action="?/addSocio" enctype="multipart/form-data" class="space-y-4">
			<div class="grid gap-4 py-4">
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="name" class="text-right">Nombre</Label>
					<Input id="name" name="name" class="col-span-3" required />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="photo" class="text-right">Foto</Label>
					<Input id="photo" name="photo" type="file" class="col-span-3" />
				</div>
				<div class="grid grid-cols-4 items-center gap-4">
					<Label for="ci" class="text-right">CI</Label>
					<Input id="ci" name="ci" class="col-span-3" />
				</div>
				<div>
					<Label for="phone">Celular</Label>
					<Input id="phone" name="phone" />
				</div>
				<div>
					<Label for="birth_date">Fecha de Nacimiento</Label>
					<Input id="birth_date" name="birth_date" type="date" />
				</div>
				<div>
					<Label for="membership_type">Tipo de Cuota</Label>
					<Input id="membership_type" name="membership_type" />
				</div>
			</div>

			<h3 class="font-semibold text-lg pt-4">Contacto de Emergencia</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<Label for="emergency_contact_name">Nombre</Label>
					<Input id="emergency_contact_name" name="emergency_contact_name" />
				</div>
				<div>
					<Label for="emergency_contact_phone">Teléfono</Label>
					<Input id="emergency_contact_phone" name="emergency_contact_phone" />
				</div>
			</div>
			
			<h3 class="font-semibold text-lg pt-4">Información Adicional</h3>
			<div>
				<Label for="illnesses">Enfermedades</Label>
				<Textarea id="illnesses" name="illnesses" placeholder="Alergias, condiciones médicas, etc." />
			</div>
			<div>
				<Label for="comments">Comentarios</Label>
				<Textarea id="comments" name="comments" placeholder="Notas adicionales" />
			</div>

			<div class="pt-6">
				<Button type="submit" class="w-full">Guardar Socio</Button>
			</div>
		</form>
	</div>
{/if} 
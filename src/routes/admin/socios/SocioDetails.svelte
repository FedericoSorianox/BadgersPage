<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { fly } from 'svelte/transition';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '$lib/components/ui/select';
	import { invalidateAll } from '$app/navigation';

	export let socio: any;
	export let show: boolean;
	export let editMode = false;

	let status: string | undefined;
	let membership_type: string | undefined;

	$: {
		if (socio) {
			status = socio.status;
			membership_type = socio.membership_type;
		}
	}

	$: selectedStatusObject = status
		? { value: status, label: status === 'Inactive' ? 'Inactivo' : status }
		: undefined;

	function handleStatusChange(selected: { value: string; label?: string } | undefined) {
		status = selected?.value;
	}

	$: selectedMembershipObject = membership_type
		? { value: membership_type, label: membership_type }
		: undefined;

	function handleMembershipChange(selected: { value: string; label?: string } | undefined) {
		membership_type = selected?.value;
	}

	function close() {
		show = false;
		editMode = false; // Reset edit mode on close
	}

	function generateCredential(name: string, type: 'email' | 'password') {
		if (!name) return 'No especificado';
		const lowerCaseName = name.toLowerCase();
		if (type === 'email') {
			return `${lowerCaseName.replace(/\s+/g, '.')}@badgers.com`;
		}
		return lowerCaseName.replace(/\s+/g, '');
	}

	// Function to handle form submission
	function handleSubmit() {
		// This will trigger the form's on:submit which is handled by sveltekit's actions
	}
</script>

{#if show && socio}
	<button
		class="fixed inset-0 bg-black bg-opacity-50 z-40 cursor-default"
		on:click={close}
		transition:fly={{ duration: 300, x: '100%' }}
		tabindex="-1"
		aria-label="Cerrar detalles"
	/>

	<form
		method="POST"
		action="?/updateSocio"
		class="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-lg p-6 overflow-y-auto"
		transition:fly={{ duration: 300, x: '100%' }}
	>
		<input type="hidden" name="id" value={socio.id} />
		<input type="hidden" name="status" value={status} />
		<input type="hidden" name="membership_type" value={membership_type} />

		<div class="flex justify-between items-center mb-6">
			<h2 class="text-2xl font-bold">{editMode ? 'Editar Socio' : 'Detalles del Socio'}</h2>
			<div>
				{#if !editMode}
					<Button type="button" variant="outline" on:click={() => (editMode = true)}>Editar</Button>
				{/if}
				<Button type="button" variant="ghost" on:click={close}>✕</Button>
			</div>
		</div>

		{#if socio.photo_url && !editMode}
			<div class="mb-6">
				<img
					src={socio.photo_url}
					alt="Foto de {socio.name}"
					class="w-full h-auto rounded-lg shadow-md object-cover"
				/>
			</div>
		{/if}

		<div class="space-y-6">
			<!-- Foto -->
			{#if editMode}
				<div>
					<Label for="photo">Cambiar Foto</Label>
					<Input id="photo" name="photo" type="file" />
				</div>
			{/if}

			<!-- Credenciales de Acceso -->
			<div>
				<h3 class="font-semibold text-lg mb-2">Credenciales de Acceso</h3>
				<div class="space-y-1 text-gray-700">
					<p><strong>Usuario (Email):</strong> {generateCredential(socio.name, 'email')}</p>
					<p><strong>Contraseña:</strong> {generateCredential(socio.name, 'password')}</p>
				</div>
			</div>

			<!-- Información Personal -->
			<div>
				<h3 class="font-semibold text-lg mb-2">Información Personal</h3>
				<div class="space-y-4 text-gray-700">
					<div>
						<Label for="name">Nombre</Label>
						{#if editMode}
							<Input id="name" name="name" value={socio.name || ''} />
						{:else}
							<p>{socio.name || 'No especificado'}</p>
						{/if}
					</div>
					<div>
						<Label for="ci">CI</Label>
						{#if editMode}
							<Input id="ci" name="ci" value={socio.ci || ''} />
						{:else}
							<p>{socio.ci || 'No especificado'}</p>
						{/if}
					</div>
					<div>
						<Label for="phone">Celular</Label>
						{#if editMode}
							<Input id="phone" name="phone" value={socio.phone || ''} />
						{:else}
							<p>{socio.phone || 'No especificado'}</p>
						{/if}
					</div>
					<div>
						<Label for="birth_date">Fecha de Nacimiento</Label>
						{#if editMode}
							<Input type="date" id="birth_date" name="birth_date" value={socio.birth_date || ''} />
						{:else}
							<p>{socio.birth_date || 'No especificado'}</p>
						{/if}
					</div>
					<div>
						<Label for="membership_type">Tipo de Cuota</Label>
						{#if editMode}
							<Select
								portal={null}
								selected={selectedMembershipObject}
								onSelectedChange={handleMembershipChange}
							>
								<SelectTrigger>
									<SelectValue placeholder="Seleccionar tipo de cuota" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="Libre - $2000">Libre - $2000</SelectItem>
										<SelectItem value="Solo Pesas - $800">Solo Pesas - $800</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						{:else}
							<p>{socio.membership_type || 'No especificado'}</p>
						{/if}
					</div>
				</div>
			</div>

			<!-- Contacto de Emergencia -->
			<div>
				<h3 class="font-semibold text-lg mb-2">Contacto de Emergencia</h3>
				<div class="space-y-4 text-gray-700">
					<div>
						<Label for="emergency_contact_name">Nombre</Label>
						{#if editMode}
							<Input
								id="emergency_contact_name"
								name="emergency_contact_name"
								value={socio.emergency_contact_name || ''}
							/>
						{:else}
							<p>{socio.emergency_contact_name || 'No especificado'}</p>
						{/if}
					</div>
					<div>
						<Label for="emergency_contact_phone">Teléfono</Label>
						{#if editMode}
							<Input
								id="emergency_contact_phone"
								name="emergency_contact_phone"
								value={socio.emergency_contact_phone || ''}
							/>
						{:else}
							<p>{socio.emergency_contact_phone || 'No especificado'}</p>
						{/if}
					</div>
				</div>
			</div>

			<!-- Estado Actual -->
			<div>
				<h3 class="font-semibold text-lg mb-2">Estado Actual</h3>
				{#if editMode}
					<Select portal={null} selected={selectedStatusObject} onSelectedChange={handleStatusChange}>
						<SelectTrigger>
							<SelectValue placeholder="Seleccionar estado" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="Activo">Activo</SelectItem>
								<SelectItem value="Inactive">Inactivo</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				{:else}
					<span
						class="px-3 py-1 text-sm font-semibold rounded-full"
						class:bg-green-100={socio.status === 'Activo'}
						class:text-green-800={socio.status === 'Activo'}
						class:bg-yellow-100={socio.status !== 'Activo'}
						class:text-yellow-800={socio.status !== 'Activo'}
					>
						{socio.status === 'Inactive' ? 'Inactivo' : socio.status || 'No especificado'}
					</span>
				{/if}
			</div>

			<!-- Información Adicional -->
			<div>
				<h3 class="font-semibold text-lg mb-2">Información Adicional</h3>
				<div class="space-y-4 text-gray-700">
					<div>
						<Label for="illnesses">Enfermedades</Label>
						{#if editMode}
							<Textarea id="illnesses" name="illnesses" value={socio.illnesses || ''} />
						{:else}
							<p>{socio.illnesses || 'No especificado'}</p>
						{/if}
					</div>
					<div>
						<Label for="comments">Comentarios</Label>
						{#if editMode}
							<Textarea id="comments" name="comments" value={socio.comments || ''} />
						{:else}
							<p>{socio.comments || 'No especificado'}</p>
						{/if}
					</div>
				</div>
			</div>

			{#if editMode}
				<div class="flex justify-end gap-4 mt-8">
					<Button type="button" variant="ghost" on:click={() => (editMode = false)}>Cancelar</Button>
					<Button type="submit" on:click={handleSubmit}>Guardar Cambios</Button>
				</div>
			{/if}
		</div>
	</form>
{/if} 
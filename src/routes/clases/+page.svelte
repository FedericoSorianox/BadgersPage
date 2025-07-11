<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';

	export let data;
	export let form;

	$: classes = data.disciplines || [];
	let scheduleData = data.schedule || [];
	$: events = data.events || [];
	$: isAdmin = data.profile?.role === 'admin';
	$: clasesBackgroundUrl = data.siteSettings?.clases_background_url || '/gallery/2.jpg';

	let scheduleDataForForm: string = '';

	function handleScheduleInput(
		event: Event & { currentTarget: HTMLInputElement },
		rowIndex: number,
		field: keyof (typeof scheduleData)[0]
	) {
		const value = event.currentTarget.value;
		const updatedRow = { ...scheduleData[rowIndex], [field]: value };
		scheduleData[rowIndex] = updatedRow;
		scheduleData = [...scheduleData]; // Forzar la reactividad de Svelte
	}

	// TODO: Añadir un sistema de notificaciones más elegante si se desea.
</script>

{#if form?.message}
	<div
		class="fixed top-20 right-5 p-4 rounded-md shadow-lg z-50"
		class:bg-green-100={form?.success}
		class:text-green-800={form?.success}
		class:bg-red-100={!form?.success}
		class:text-red-800={!form?.success}
		role="alert"
	>
		{form.message}
	</div>
{/if}

<div class="parallax-container">
	<div class="parallax-bg-clases" style="background-image: url({clasesBackgroundUrl})"></div>
	<div class="content-on-top">
		{#if isAdmin}
			<div class="bg-gray-800 p-4 text-white">
				<form
					method="POST"
					action="?/updateClasesBackground"
					enctype="multipart/form-data"
					use:enhance
					class="flex items-center gap-4"
				>
					<label for="background_image">Cambiar fondo:</label>
					<Input id="background_image" name="background_image" type="file" accept="image/*" />
					<Button type="submit">Subir</Button>
				</form>
			</div>
		{/if}
		<div class="container mx-auto px-4 py-16 bg-black/50">
			<div class="text-center mb-16">
				<h1 class="text-4xl md:text-5xl font-extrabold text-white">
					Nuestras <span class="text-badger-accent">Disciplinas</span>
				</h1>
				<p class="text-lg text-gray-200 mt-2">Encuentra tu camino en el tatami.</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
				{#each classes as martialArt}
					<div class="bg-white rounded-lg shadow-lg overflow-hidden text-center border">
						<form
							method="POST"
							action="?/updateDiscipline"
							use:enhance
							class="flex flex-col h-full"
							enctype="multipart/form-data"
						>
							<input type="hidden" name="id" value={martialArt.id} />
							<input type="hidden" name="current_image_url" value={martialArt.image_url} />

							<img
								src={martialArt.image_url || 'https://via.placeholder.com/600x400?text=The+Badgers'}
								alt={martialArt.name}
								class="w-full h-48 object-cover"
							/>
							<div class="p-6 flex flex-col flex-grow">
								{#if isAdmin}
									<Input
										class="text-2xl font-bold mb-2 text-center"
										name="name"
										value={martialArt.name}
									/>
									<Textarea
										class="text-gray-700 flex-grow"
										name="description"
										value={martialArt.description}
									/>
								{:else}
									<h3 class="text-2xl font-bold mb-2 text-badger-dark">{martialArt.name}</h3>
									<p class="text-gray-700">{martialArt.description}</p>
								{/if}
							</div>
							{#if isAdmin}
								<div class="p-6 pt-0 space-y-4">
									<div>
										<label for="image-{martialArt.id}" class="sr-only">Cambiar Imagen</label>
										<Input id="image-{martialArt.id}" name="image" type="file" accept="image/*" />
									</div>
									<div class="flex space-x-2">
										<Button type="submit" class="w-full">Guardar Cambios</Button>
										<form method="POST" action="?/deleteDiscipline" use:enhance class="w-full">
											<input type="hidden" name="id" value={martialArt.id} />
											<Button type="submit" variant="destructive" class="w-full">Eliminar</Button>
										</form>
									</div>
								</div>
							{/if}
						</form>
					</div>
				{/each}
			</div>

			{#if isAdmin}
				<div class="max-w-4xl mx-auto mb-20">
					<Card>
						<CardHeader>
							<CardTitle>Añadir Nueva Disciplina</CardTitle>
						</CardHeader>
						<CardContent>
							<form
								method="POST"
								action="?/createDiscipline"
								use:enhance
								class="space-y-4"
								enctype="multipart/form-data"
							>
								<div>
									<Label for="name">Nombre</Label>
									<Input id="name" name="name" required />
								</div>
								<div>
									<Label for="description">Descripción</Label>
									<Textarea id="description" name="description" />
								</div>
								<div>
									<Label for="image">Imagen</Label>
									<Input id="image" name="image" type="file" accept="image/*" />
								</div>
								<Button type="submit" class="w-full">Crear Disciplina</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			{/if}

			<!-- Sección de Eventos -->
			<div class="text-center mb-12">
				<h2 class="text-4xl md:text-5xl font-extrabold text-white">
					Próximos <span class="text-badger-accent">Eventos</span>
				</h2>
				<p class="text-lg text-gray-200 mt-2">¡No te pierdas nuestras próximas actividades!</p>
			</div>

			<div class="max-w-4xl mx-auto mb-20">
				<Card class="bg-white/90">
					<CardHeader>
						<CardTitle>Calendario de Eventos</CardTitle>
					</CardHeader>
					<CardContent class="space-y-6">
						{#each events as event}
							<div
								class="p-4 border rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
							>
								<div class="flex items-start gap-4">
									<img
										src={event.image_url || 'https://via.placeholder.com/150?text=Evento'}
										alt="Imagen del evento {event.title}"
										class="w-24 h-24 object-cover rounded-md hidden sm:block"
									/>
									<div>
										<p class="font-bold text-lg">{event.title}</p>
										<p class="text-sm text-gray-600">
											{new Date(event.event_date + 'T00:00:00').toLocaleDateString('es-ES', {
												year: 'numeric',
												month: 'long',
												day: 'numeric'
											})}
										</p>
										<p class="mt-2">{event.description}</p>
									</div>
								</div>
								{#if isAdmin}
									<div class="flex space-x-2 self-start md:self-center">
										<!-- TODO: Implementar un modal para editar -->
										<Button variant="outline" size="sm">Editar</Button>
										<form method="POST" action="?/deleteEvent" use:enhance>
											<input type="hidden" name="id" value={event.id} />
											<input type="hidden" name="current_image_url" value={event.image_url} />
											<Button type="submit" variant="destructive" size="sm">Eliminar</Button>
										</form>
									</div>
								{/if}
							</div>
						{/each}

						{#if events.length === 0}
							<p class="text-center text-gray-500">No hay eventos programados por el momento.</p>
						{/if}

						{#if isAdmin}
							<div class="pt-6 border-t">
								<h3 class="text-lg font-semibold mb-4 text-gray-800">Añadir Nuevo Evento</h3>
								<form
									method="POST"
									action="?/saveEvent"
									use:enhance
									class="space-y-4"
									enctype="multipart/form-data"
								>
									<div>
										<Label for="title" class="text-gray-800">Título del Evento</Label>
										<Input id="title" name="title" required />
									</div>
									<div>
										<Label for="event_date" class="text-gray-800">Fecha</Label>
										<Input id="event_date" name="event_date" type="date" required />
									</div>
									<div>
										<Label for="description" class="text-gray-800">Descripción</Label>
										<Textarea id="description" name="description" />
									</div>
									<div>
										<Label for="image" class="text-gray-800">Imagen del Evento</Label>
										<Input id="image" name="image" type="file" accept="image/*" />
									</div>
									<Button type="submit" class="w-full">Guardar Evento</Button>
								</form>
							</div>
						{/if}
					</CardContent>
				</Card>
			</div>

			<div class="text-center mb-12">
				<h2 class="text-4xl md:text-5xl font-extrabold text-white">
					Horario <span class="text-badger-accent">Semanal</span>
				</h2>
				<p class="text-lg text-gray-200 mt-2">Planifica tu entrenamiento.</p>
			</div>

			<form method="POST" action="?/updateSchedule" use:enhance>
				<input type="hidden" name="scheduleData" value={JSON.stringify(scheduleData)} />
				<div class="overflow-x-auto bg-white rounded-lg shadow-xl border">
					<table class="w-full text-sm text-left text-gray-700">
						<thead class="text-xs text-badger-dark uppercase bg-gray-200">
							<tr>
								<th scope="col" class="px-6 py-3">Hora</th>
								<th scope="col" class="px-6 py-3">Lunes</th>
								<th scope="col" class="px-6 py-3">Martes</th>
								<th scope="col" class="px-6 py-3">Miércoles</th>
								<th scope="col" class="px-6 py-3">Jueves</th>
								<th scope="col" class="px-6 py-3">Viernes</th>
								<th scope="col" class="px-6 py-3">Sábado</th>
							</tr>
						</thead>
						<tbody>
							{#each scheduleData as row, i (row.id)}
								<tr class="border-b {i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
									{#if isAdmin}
										<td class="px-6 py-4">
											<input
												type="text"
												class="input input-bordered w-full"
												bind:value={row.time_slot}
											/>
										</td>
										<td class="px-6 py-4">
											<input
												type="text"
												class="input input-bordered w-full"
												bind:value={row.monday}
											/>
										</td>
										<td class="px-6 py-4">
											<input
												type="text"
												class="input input-bordered w-full"
												bind:value={row.tuesday}
											/>
										</td>
										<td class="px-6 py-4">
											<input
												type="text"
												class="input input-bordered w-full"
												bind:value={row.wednesday}
											/>
										</td>
										<td class="px-6 py-4">
											<input
												type="text"
												class="input input-bordered w-full"
												bind:value={row.thursday}
											/>
										</td>
										<td class="px-6 py-4">
											<input
												type="text"
												class="input input-bordered w-full"
												bind:value={row.friday}
											/>
										</td>
										<td class="px-6 py-4">
											<input
												type="text"
												class="input input-bordered w-full"
												bind:value={row.saturday}
											/>
										</td>
									{:else}
										<th
											scope="row"
											class="px-6 py-4 font-bold text-badger-dark whitespace-nowrap"
										>
											{row.time_slot}
										</th>
										<td class="px-6 py-4">{row.monday}</td>
										<td class="px-6 py-4">{row.tuesday}</td>
										<td class="px-6 py-4">{row.wednesday}</td>
										<td class="px-6 py-4">{row.thursday}</td>
										<td class="px-6 py-4">{row.friday}</td>
										<td class="px-6 py-4">{row.saturday}</td>
									{/if}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				{#if isAdmin}
					<div class="mt-4 flex space-x-4">
						<Button type="submit" class="w-full">Guardar Horario</Button>
						<Button
							type="button"
							class="w-full"
							variant="outline"
							on:click={() => {
								const newRow = {
									id: Date.now(), // ID temporal para el renderizado
									isNew: true, // Flag para identificar la nueva fila en el servidor
									time_slot: '',
									monday: '',
									tuesday: '',
									wednesday: '',
									thursday: '',
									friday: '',
									saturday: ''
								};
								scheduleData = [...scheduleData, newRow];
								console.log('Nueva fila añadida (cliente):', newRow);
								console.log('Estado del horario ahora:', scheduleData);
							}}>Añadir Fila</Button
						>
					</div>
				{/if}
			</form>
		</div>
	</div>
</div>
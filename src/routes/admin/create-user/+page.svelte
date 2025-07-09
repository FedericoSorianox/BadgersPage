<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-6">Crear Nuevo Usuario</h1>

	<div class="max-w-md bg-white p-6 rounded-lg shadow-md">
		<form method="POST" use:enhance>
			{#if form?.message}
				<div
					class="mb-4 p-3 rounded-md"
					class:bg-green-100={form.success}
					class:text-green-800={form.success}
					class:bg-red-100={!form.success}
					class:text-red-800={!form.success}
				>
					{form.message}
				</div>
			{/if}

			<div class="space-y-4">
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700">
						Nombre de Usuario
					</label>
					<input
						id="name"
						name="name"
						type="text"
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700">
						Contraseña
					</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<div>
					<label for="role" class="block text-sm font-medium text-gray-700"> Rol </label>
					<select
						id="role"
						name="role"
						required
						class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="user">User</option>
						<option value="admin">Admin</option>
					</select>
				</div>
			</div>

			<div class="mt-6">
				<button
					type="submit"
					class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
				>
					Crear Usuario
				</button>
			</div>
		</form>
	</div>
</div> 
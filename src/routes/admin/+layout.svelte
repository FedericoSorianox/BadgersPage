<script lang="ts">
	import '../../app.css';

	export let data;

	$: session = data.session;
	$: profile = data.profile;
</script>

{#if session && profile?.role === 'admin'}
	<div class="flex flex-col min-h-screen bg-gray-50">

		<main class="flex-grow container mx-auto p-4">
			<div class="p-4 bg-gray-100 border-b flex items-center justify-between">
				<div>
					<span class="font-bold">Usuario:</span>
					{session.user.email}
					<span class="ml-4 font-bold">Rol:</span>
					<span class="bg-green-200 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
						{profile.role}
					</span>
				</div>
				<a href="/" class="text-blue-600 hover:underline">Volver al inicio</a>
			</div>
			<div class="container mx-auto p-4">
				<slot />
			</div>
		</main>

		<footer class="bg-badger-dark text-badger-light text-center p-4">
			<p>&copy; {new Date().getFullYear()} The Badgers. Todos los derechos reservados.</p>
		</footer>
	</div>
{:else}
	<div class="text-center p-16">
		<h1 class="text-2xl font-bold">Acceso Denegado</h1>
		<p class="mt-4">No tienes permiso para ver esta página.</p>
		<a href="/" class="text-blue-600 hover:underline mt-8 inline-block">Volver al inicio</a>
	</div>
{/if}
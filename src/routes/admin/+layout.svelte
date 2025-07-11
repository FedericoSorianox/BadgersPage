<script lang="ts">
	import '../../app.css';
	import { page } from '$app/stores';

	export let data;

	$: session = data.session;
	$: profile = data.profile;

	const navLinks = [
		{ href: '/admin', text: 'Dashboard' },
		{ href: '/admin/socios', text: 'Socios' },
		{ href: '/admin/pagos', text: 'Pagos' },
		{ href: '/admin/inventario', text: 'Inventario' },
		{ href: '/admin/finanzas', text: 'Finanzas' }
	];
</script>

{#if session && profile?.role === 'admin'}
	<div class="flex flex-col min-h-screen bg-gray-50">
		<main class="flex-grow container mx-auto p-4">
			<!-- User Info and Tabs Navigation -->
			<div class="bg-gray-100 rounded-lg p-4 mb-8">
				<div class="flex justify-between items-center mb-4">
					<div>
						<span class="font-bold">Usuario:</span>
						{session.user.email}
						<span class="ml-4 font-bold">Rol:</span>
						<span class="bg-green-200 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
							{profile.role}
						</span>
					</div>
				</div>
				<div class="mt-4">
					<nav class="flex justify-center space-x-4" aria-label="Tabs">
						{#each navLinks as link}
							<a
								href={link.href}
								class="py-2 px-4 font-medium text-sm rounded-md transition-colors"
								class:bg-blue-500={$page.url.pathname === link.href}
								class:text-white={$page.url.pathname === link.href}
								class:text-gray-600={$page.url.pathname !== link.href}
								class:hover:bg-gray-200={$page.url.pathname !== link.href}
							>
								{link.text}
							</a>
						{/each}
					</nav>
				</div>
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
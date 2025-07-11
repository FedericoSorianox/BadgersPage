<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { enhance } from '$app/forms';
	export let data;
	$: isAdmin = data.profile?.role === 'admin';
	$: landingBackgroundUrl = data.siteSettings?.landing_background_url || '/gallery/1.jpg';
	// En el futuro, aquí podemos cargar datos dinámicos si los necesitas.
	// Por ejemplo, la lista de clases podría venir de Supabase.

	// Datos de ejemplo para nuestras clases.
	const classes = [
		{
			name: 'Jiu Jitsu Gi',
			description:
				'El arte suave. Domina técnicas de control y sumisión en el sueloy de pie. Es una disciplina deportiva y de defensa personal en la cual se utiliza el GI',
			img: 'https://cdn.evolve-mma.com/wp-content/uploads/2018/09/dlr.jpg' // Reemplaza con una imagen real
		},
		{
			name: 'Muay Thai',
			description:
				'Combina puños, codos, rodillas y piernas. Conocido como el arte de las ocho extremidades. Arte macrial de origen tailandés. Es una disciplina deportiva y de defensa personal',
			img: 'https://media.istockphoto.com/id/2149192489/photo/two-young-professional-boxer-having-a-competition-tournament-on-stage-attractive-male-athlete.jpg?s=612x612&w=0&k=20&c=Y9pbrzF3iSuyI4m5chdsabRbX8X2k7Wp11T1EoCpqKE=' // Reemplaza con una imagen real
		},
		{
			name: 'Jiu Jitsu No Gi',
			description:
				'Jiu Jitsu sin el uso del GI. Enfocado en técnicas de control y sumisión sin el uniforme. Es una disciplina deportiva y de defensa personal en la cual se utiliza ropa deportiva',
			img: 'https://as2.ftcdn.net/v2/jpg/04/81/31/81/1000_F_481318179_fKQ1ApO31J5owIEqkUh2eFnbVAbrBG1C.jpg' // Reemplaza con una imagen real
		}
	];
</script>

<div class="parallax-container">
	<div class="parallax-bg" style="background-image: url({landingBackgroundUrl})"></div>
	<div class="content-on-top">
		<section
			class="flex flex-col items-center justify-center text-center text-badger-light py-20 px-4 bg-black/50"
		>
			<img src="/logo-badgers.png" alt="Logo de The Badgers" class="w-64 md:w-80 mb-8" />

			<h1 class="text-4xl font-extrabold mb-4 text-white">Forja tu Carácter en The Badgers</h1>

			<p class="max-w-2xl mb-8 text-lg text-gray-300">
				Más que una academia, una comunidad. Descubre la disciplina, el respeto y la fuerza a
				través de las artes marciales.
			</p>

			<div class="mt-4">
				<a
					href="/clases"
					class="bg-white text-brand-teal font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105"
				>
					Ver Clases y Horarios
				</a>
			</div>
		</section>
		{#if isAdmin}
			<div class="bg-gray-800 p-4 text-white">
				<form
					method="POST"
					action="?/updateLandingBackground"
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
	</div>
</div>

<section id="clases" class="py-20 bg-gray-50">
	<div class="container mx-auto px-4">
		<div class="text-center mb-12">
			<h2 class="text-4xl font-bold">Nuestras Disciplinas</h2>
			<p class="text-gray-600 mt-2">Encuentra el arte marcial que se adapta a ti.</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			{#each classes as martialArt}
				<div class="bg-white rounded-lg shadow-lg overflow-hidden text-center">
					<img src={martialArt.img} alt={martialArt.name} class="w-full h-48 object-cover" />
					<div class="p-6">
						<h3 class="text-2xl font-bold mb-2">{martialArt.name}</h3>
						<p class="text-gray-700">{martialArt.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section id="cta" class="bg-badger-dark">
	<div class="container mx-auto px-4 py-16 text-center">
		<h2 class="text-3xl font-bold text-white">¿Listo para tu clase de prueba?</h2>
		<p class="text-gray-400 mt-2 mb-6">
			El primer paso es el más importante. ¡Te esperamos en el tatami!
		</p>
		<a
			href="/contacto"
			class="bg-white text-brand-teal font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105"
		>
			Contáctanos
		</a>
	</div>
</section>
<script lang="ts">
	import { Instagram, Smartphone, MapPin } from 'lucide-svelte';
</script>

<div class="container mx-auto px-4 py-16">
	<div class="text-center mb-12">
		<h1 class="text-4xl md:text-5xl font-extrabold">
			<span class="text-badger-accent">Contáctanos</span>
		</h1>
		<p class="text-lg text-gray-600 mt-2">Estamos para ayudarte. ¡Ponte en contacto!</p>
	</div>

	<div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg border">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
			<!-- Información de Contacto -->
			<div class="space-y-6">
				<div>
					<h2 class="text-2xl font-bold text-badger-dark mb-4">Nuestras Redes y Contacto</h2>
					<ul class="space-y-4 text-lg">
						<li class="flex items-center">
							<a
								href="https://www.instagram.com/thebadgers.uy/"
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center text-gray-700 hover:text-badger-accent transition-colors"
							>
								<Instagram class="w-6 h-6 mr-3" />
								<span>@thebadgers.uy</span>
							</a>
						</li>
						<li class="flex items-center">
							<a
								href="https://wa.me/59892627480"
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center text-gray-700 hover:text-badger-accent transition-colors"
							>
								<Smartphone class="w-6 h-6 mr-3" />
								<span>092 627 480</span>
							</a>
						</li>
					</ul>
				</div>

				<div>
					<h2 class="text-2xl font-bold text-badger-dark mb-4 mt-8">Nuestra Ubicación</h2>
					<div class="flex items-start">
						<MapPin class="w-6 h-6 mr-3 mt-1 flex-shrink-0" />
						<address class="text-lg text-gray-700 not-italic">
							Tenerife M G1 S 25 <br />
							entre Calle 70 y Fuerte Ventura, <br />
							Solymar, Ciudad de la Costa.
						</address>
					</div>
				</div>
			</div>

			<!-- Mapa -->
			<div>
				<div class="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden shadow-md">
					<iframe
						title="Ubicación de The Badgers"
						src="https://maps.google.com/maps?q=Academia%20The%20Badgers,Tenerife%20MG1%20S25,%20Solymar&t=&z=17&ie=UTF8&iwloc=&output=embed"
						width="100%"
						height="100%"
						style="border:0;"
						allowfullscreen={true}
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade"
					></iframe>
				</div>
			</div>
		</div>
	</div>
</div>
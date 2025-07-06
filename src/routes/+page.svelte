<script lang="ts">
  // En el futuro, aquí podemos cargar datos dinámicos si los necesitas.
  // Por ejemplo, la lista de clases podría venir de Supabase.

  // Datos de ejemplo para nuestras clases.
  const classes = [
    {
      name: 'Jiu-Jitsu Brasileño',
      description: 'El arte suave. Domina técnicas de control y sumisión en el suelo. Ideal para la defensa personal.',
      img: 'https://via.placeholder.com/400x300?text=Jiu-Jitsu' // Reemplaza con una imagen real
    },
    {
      name: 'Muay Thai',
      description: 'Conocido como el arte de las ocho extremidades. Un striking contundente que mejora tu condición física.',
      img: 'https://via.placeholder.com/400x300?text=Muay+Thai' // Reemplaza con una imagen real
    },
    {
      name: 'Boxeo',
      description: 'Disciplina y agilidad. Aprende el juego de pies, la defensa y los golpes precisos de este deporte olímpico.',
      img: 'https://via.placeholder.com/400x300?text=Boxeo' // Reemplaza con una imagen real
    }
  ];
</script>

<section class="flex flex-col items-center justify-center bg-badger-dark text-center text-badger-light py-20">
  <img src="/logo-badgers.png" alt="Logo de The Badgers" class="w-32 h-32 mb-4" />
  <h1 class="text-5xl font-extrabold mb-4">
    Forja tu Carácter en <span class="text-badger-accent">The Badgers</span>
  </h1>
  <p class="max-w-2xl mb-8 text-lg text-gray-300">
    Más que una academia, una comunidad. Descubre la disciplina, el respeto y la fuerza a través de las artes marciales.
  </p>
  <div>
    <a href="/clases" class="bg-badger-accent text-badger-dark font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">
      Ver Clases y Horarios
    </a>
  </div>
</section>

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
    <p class="text-gray-300 mt-2 mb-6">
      El primer paso es el más importante. ¡Te esperamos en el tatami!
    </p>
    <a href="/contacto" class="bg-badger-accent text-badger-dark font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity">
      Contáctanos
    </a>
  </div>
</section>
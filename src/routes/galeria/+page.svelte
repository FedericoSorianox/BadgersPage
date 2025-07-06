<script lang="ts">
  // Importamos el componente Lightbox de la librería que instalamos
  import { Lightbox } from 'svelte-lightbox';

  // --- LISTA DE IMÁGENES DE LA GALERÍA ---
  // TODO: Actualiza esta lista para que coincida con los nombres de tus archivos de imagen.
  // La ruta comienza con '/gallery/' porque los archivos están en la carpeta 'static/gallery'.
  const galleryImages = [
    { src: '/gallery/foto1.png', alt: 'Team' },
    { src: '/gallery/1.jpg', alt: 'Clase de Muay Thai' },
    { src: '/gallery/2.jpg', alt: 'Compañerismo en el tatami' },
    { src: '/gallery/3.jpg', alt: 'Técnica de derribo' },
    { src: '/gallery/4.jpg', alt: 'Clase de niños' },
    { src: '/gallery/foto6.jpg', alt: 'Foto grupal de la academia' },
    { src: '/gallery/foto7.jpg', alt: 'Entrenamiento de Boxeo' },
    { src: '/gallery/foto8.jpg', alt: 'Open Mat de sábado' },
  ];
</script>

<div class="container mx-auto px-4 py-16">
  <div class="text-center mb-12">
    <h1 class="text-4xl md:text-5xl font-extrabold">
      Nuestra <span class="text-badger-accent">Galería</span>
    </h1>
    <p class="text-lg text-gray-600 mt-2">Un vistazo a nuestra comunidad en acción.</p>
  </div>

  <Lightbox>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {#each galleryImages as image}
        <div class="group relative">
          <img 
            src={image.src} 
            alt={image.alt} 
            class="aspect-square w-full h-full object-cover rounded-lg shadow-md cursor-pointer transition-transform duration-300 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-lg">
            <p class="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2">{image.alt}</p>
          </div>
        </div>
      {/each}
    </div>
  </Lightbox>
</div>
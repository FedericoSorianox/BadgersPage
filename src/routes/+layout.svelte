<script lang="ts">
  import '../app.css'; // Importa los estilos globales de Tailwind
  import Navbar from '$lib/components/Navbar.svelte'; // Importamos nuestro nuevo componente
</script>

<div class="flex flex-col min-h-screen bg-gray-50">
  <Navbar />

  <main class="flex-grow">
    <slot />
  </main>

  <footer class="bg-badger-dark text-badger-light text-center p-4">
    <p>&copy; {new Date().getFullYear()} The Badgers. Todos los derechos reservados.</p>
    <p class="text-sm mt-2">Ciudad de la Costa, Uruguay</p>
  </footer>
</div>
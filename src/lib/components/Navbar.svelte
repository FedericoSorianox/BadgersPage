<script lang="ts">
  // Importamos el logo para usarlo en la barra de navegación
  import logo from '$lib/assets/logo-header.png'; // Asumiendo que mueves el logo a esta nueva ruta
</script>

<header class="bg-badger-dark text-badger-light shadow-md sticky top-0 z-50">
  <nav class="container mx-auto px-6 py-3 flex justify-between items-center">
    <a href="/" class="flex items-center">
      <img src={logo} alt="Logo The Badgers" class="h-12 mr-3" />
      <span class="font-bold text-xl hidden md:block">The Badgers</span>
    </a>

    <ul class="flex items-center space-x-6">
      <li><a href="/sobre-nosotros" class="hover:text-badger-accent transition-colors">Sobre Nosotros</a></li>
      <li><a href="/clases" class="hover:text-badger-accent transition-colors">Clases</a></li>
      <li><a href="/galeria" class="hover:text-badger-accent transition-colors">Galería</a></li>
      <li><a href="/tienda" class="hover:text-badger-accent transition-colors">Tienda</a></li>
      <li><a href="/contacto" class="bg-badger-accent text-badger-dark font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">Contacto</a></li>
    </ul>
  </nav>
</header>
<script lang="ts">
  import logo from '$lib/assets/logo-header.png';
  import { page } from '$app/stores';

  $: session = $page.data.session;
  $: profile = $page.data.profile;

  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  }
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

      {#if session}
        {#if profile?.role === 'admin'}
        <li>
          <a href="/admin" class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs">Admin</a>
        </li>
        {/if}
        <li class="ml-4 text-xs text-badger-accent">{session.user.email}</li>
        <li>
          <button
            on:click={logout}
            class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs">Logout</button
          >
        </li>
        <li>
          <a href="/account" class="text-sm text-blue-600 hover:underline">Mi Cuenta</a>
        </li>
      {:else}
        <li><a href="/login" class="hover:text-badger-accent transition-colors">Login</a></li>
      {/if}
      <li>
        <a
          href="/contacto"
          class="bg-badger-accent text-badger-dark font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >Contacto</a
        >
      </li>
    </ul>
  </nav>
</header>
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

<header class="bg-brand-teal text-white shadow-md sticky top-0 z-50 border-b border-border">
  <nav class="container mx-auto px-6 py-3 flex justify-between items-center">
    <a href="/" class="flex items-center">
      <img src={logo} alt="Logo The Badgers" class="h-12 mr-3" />
      <span class="font-bold text-xl hidden md:block">The Badgers</span>
    </a>

    <ul class="flex items-center space-x-2">
      <li><a href="/sobre-nosotros" class="px-3 py-2 rounded-md hover:bg-white/10 transition-colors">Sobre Nosotros</a></li>
      <li><a href="/clases" class="px-3 py-2 rounded-md hover:bg-white/10 transition-colors">Clases</a></li>
      <li><a href="/galeria" class="px-3 py-2 rounded-md hover:bg-white/10 transition-colors">Galería</a></li>
      <li><a href="/tienda" class="px-3 py-2 rounded-md hover:bg-white/10 transition-colors">Tienda</a></li>

      {#if session}
        {#if profile?.role === 'admin'}
        <li>
          <a href="/admin" class="bg-white/20 text-white px-3 py-2 rounded-md hover:bg-white/30 text-sm font-medium">Admin</a>
        </li>
        {/if}
        <li class="ml-4 text-sm text-white/80">{session.user.email}</li>
        <li>
          <button
            on:click={logout}
            class="bg-red-500/80 text-white px-3 py-2 rounded-md hover:bg-red-500 text-sm font-medium">Logout</button
          >
        </li>
        <li>
          <a href="/account" class="px-3 py-2 rounded-md text-sm hover:bg-white/10">Mi Cuenta</a>
        </li>
      {:else}
        <li><a href="/login" class="px-3 py-2 rounded-md hover:bg-white/10 transition-colors">Login</a></li>
      {/if}
      <li>
        <a
          href="/contacto"
          class="bg-white text-brand-teal font-bold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >Contacto</a
        >
      </li>
    </ul>
  </nav>
</header>
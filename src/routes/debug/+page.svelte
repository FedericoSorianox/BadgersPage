<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { checkUserProfile } from '$lib/db-check';

  let session: any = null;
  let profile: any = null;
  let loading = true;

  onMount(async () => {
    // Obtener sesión actual
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    session = currentSession;

    if (session) {
      // Obtener perfil del usuario
      profile = await checkUserProfile(session.user.id);
    }

    loading = false;
  });

  async function signOut() {
    await supabase.auth.signOut();
    window.location.reload();
  }
</script>

<div class="container mx-auto p-8">
  <h1 class="text-3xl font-bold mb-8">Debug - Estado de Autenticación</h1>

  {#if loading}
    <p>Cargando...</p>
  {:else}
    <div class="space-y-6">
      <div class="bg-gray-100 p-4 rounded">
        <h2 class="text-xl font-semibold mb-2">Sesión</h2>
        {#if session}
          <pre class="text-sm">{JSON.stringify(session, null, 2)}</pre>
        {:else}
          <p class="text-red-600">No hay sesión activa</p>
        {/if}
      </div>

      <div class="bg-gray-100 p-4 rounded">
        <h2 class="text-xl font-semibold mb-2">Perfil</h2>
        {#if profile}
          <pre class="text-sm">{JSON.stringify(profile, null, 2)}</pre>
        {:else}
          <p class="text-red-600">No se encontró perfil</p>
        {/if}
      </div>

      <div class="bg-gray-100 p-4 rounded">
        <h2 class="text-xl font-semibold mb-2">Acciones</h2>
        <div class="space-x-4">
          <a href="/admin" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Ir a Admin
          </a>
          {#if session}
            <button on:click={signOut} class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Cerrar Sesión
            </button>
          {:else}
            <a href="/login" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Ir a Login
            </a>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div> 
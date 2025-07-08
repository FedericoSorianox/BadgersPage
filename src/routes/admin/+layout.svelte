<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

  // 'data' contiene lo que nos envió el archivo `+layout.server.ts`
  export let data;

  let isLoading = true;
  let hasCheckedAuth = false;
  let error: string | null = null;

  onMount(async () => {
    try {
      // Verificar si las variables de entorno están configuradas
      if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
        error = 'Variables de entorno de Supabase no configuradas';
        isLoading = false;
        return;
      }

      // Esperamos un poco para que Supabase se inicialice completamente
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verificamos la sesión actual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        error = `Error de sesión: ${sessionError.message}`;
        isLoading = false;
        return;
      }

      console.log('data en /admin layout:', data);
      console.log('session en /admin layout:', session);

      if (!session) {
        // Si no hay sesión, redirigimos a login
        goto('/login');
        return;
      }

      // Validación robusta del rol admin
      const role = (data.role || '').trim().toLowerCase();
      if (role !== 'admin') {
        error = `Acceso denegado. Rol detectado: "${data.role}"`;
        goto('/');
        return;
      }

      // Si llegamos aquí, el usuario está autenticado y es admin
      hasCheckedAuth = true;
      isLoading = false;
    } catch (err) {
      error = `Error inesperado: ${err instanceof Error ? err.message : String(err)}`;
      isLoading = false;
    }
  });
</script>

{#if error}
  <div class="text-center p-16">
    <p class="text-red-600 mb-4">Error: {error}</p>
    <a href="/env-check" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Verificar Configuración
    </a>
  </div>
{:else if isLoading}
  <div class="text-center p-16">
    <p>Verificando acceso...</p>
  </div>
{:else if hasCheckedAuth && data.session && (data.role || '').trim().toLowerCase() === 'admin'}
  <slot />
{:else}
  <div class="text-center p-16">
    <p>Acceso denegado...</p>
    <a href="/debug" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">
      Debug
    </a>
  </div>
{/if}
<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let username = '';
  let password = '';
  let loading = false;
  let error = '';
  let debugInfo = '';

  onMount(() => {
    debugInfo = 'Página de login cargada correctamente';
    console.log('Login page mounted');
    
    // Verificar si ya está autenticado
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session check:', session);
      if (session) {
        debugInfo += ' - Usuario ya autenticado, redirigiendo...';
        goto('/');
      }
    });
  });

  async function handleLogin() {
    debugInfo = 'Intentando login...';
    loading = true;
    error = '';
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (!res.ok) {
        const result = await res.json();
        error = result.message || 'Error desconocido';
        debugInfo = 'Error de login: ' + error;
        return;
      }

      const result = await res.json();
      debugInfo = 'Login exitoso, redirigiendo...';
      window.location.href = '/admin';
    } catch (err) {
      error = 'Error inesperado. Intenta de nuevo.';
      debugInfo = 'Error inesperado: ' + err;
      console.error('Login error:', err);
    } finally {
      loading = false;
    }
  }
</script>

<div class="flex justify-center items-center py-16">
  <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
    <div>
      <h2 class="text-center text-3xl font-extrabold text-gray-900">
        Iniciar Sesión
      </h2>
      <p class="text-center text-sm text-gray-600 mt-2">
        <!-- Debug: {debugInfo} -->
      </p>
    </div>

    <form class="mt-8 space-y-6" on:submit|preventDefault={handleLogin}>
      {#if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      {/if}

      <div class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">
            Nombre de Usuario
          </label>
          <input
            id="username"
            type="text"
            bind:value={username}
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tu nombre de usuario"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            bind:value={password}
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tu contraseña"
          />
        </div>
      </div>

      <div class="space-y-3">
        <button
          type="submit"
          disabled={loading}
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if loading}
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          {/if}
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </div>
    </form>
  </div>
</div>
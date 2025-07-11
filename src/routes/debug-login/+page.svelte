<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  
  let debugInfo: string[] = [];
  let email = 'test@example.com';
  let password = 'test123';
  
  function addDebugInfo(message: string) {
    debugInfo = [...debugInfo, `${new Date().toLocaleTimeString()}: ${message}`];
    console.log(message);
  }
  
  onMount(() => {
    addDebugInfo('Página de debug cargada');
    addDebugInfo('Verificando conexión con Supabase...');
    
    // Verificar conexión
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error) {
        addDebugInfo(`Error de conexión: ${error.message}`);
      } else {
        addDebugInfo('Conexión con Supabase exitosa');
        addDebugInfo(`Sesión actual: ${user ? 'Activa' : 'No hay sesión'}`);
      }
    });
  });
  
  async function testLogin() {
    addDebugInfo(`Intentando login con: ${email}`);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        addDebugInfo(`Error de login: ${error.message}`);
      } else {
        addDebugInfo('Login exitoso');
        addDebugInfo(`Usuario: ${data.user?.email}`);
        addDebugInfo('Redirigiendo...');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (err) {
      addDebugInfo(`Error inesperado: ${err}`);
    }
  }
  
  async function testSignUp() {
    addDebugInfo(`Intentando registro con: ${email}`);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) {
        addDebugInfo(`Error de registro: ${error.message}`);
      } else {
        addDebugInfo('Registro exitoso');
        addDebugInfo('Revisa tu email para confirmar');
      }
    } catch (err) {
      addDebugInfo(`Error inesperado: ${err}`);
    }
  }
</script>

<div class="flex justify-center items-center py-16">
  <div class="w-full max-w-2xl p-8 space-y-8 bg-white rounded-lg shadow-lg">
    <div>
      <h2 class="text-center text-3xl font-extrabold text-gray-900">
        Debug Login
      </h2>
      <p class="text-center text-sm text-gray-600 mt-2">
        Página de debug para identificar problemas de login
      </p>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Email:</label>
        <input 
          type="email" 
          bind:value={email}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700">Contraseña:</label>
        <input 
          type="password" 
          bind:value={password}
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
    </div>

    <div class="flex space-x-4">
      <button 
        on:click={testLogin}
        class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Probar Login
      </button>
      
      <button 
        on:click={testSignUp}
        class="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Probar Registro
      </button>
    </div>

    <div class="bg-gray-100 p-4 rounded-md">
      <h3 class="font-bold mb-2">Log de Debug:</h3>
      <div class="max-h-64 overflow-y-auto space-y-1">
        {#each debugInfo as info}
          <div class="text-sm text-gray-700">{info}</div>
        {/each}
      </div>
    </div>

    <div class="text-center">
      <a 
        href="/login" 
        class="text-blue-600 hover:text-blue-500"
      >
        Ir a Login Normal
      </a>
    </div>
  </div>
</div> 
<script lang="ts">
  import { onMount } from 'svelte';
  
  let pageLoaded = false;
  
  onMount(() => {
    pageLoaded = true;
    console.log('Test login page loaded');
  });
</script>

<div class="flex justify-center items-center py-16">
  <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
    <div>
      <h2 class="text-center text-3xl font-extrabold text-gray-900">
        Página de Prueba
      </h2>
      <p class="text-center text-sm text-gray-600 mt-2">
        Esta es una página de prueba para verificar la navegación
      </p>
      <p class="text-center text-sm text-green-600 mt-2">
        {pageLoaded ? '✅ Página cargada correctamente' : '⏳ Cargando...'}
      </p>
    </div>

    <div class="space-y-4">
      <a 
        href="/login" 
        class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Ir a Login Real
      </a>
      
      <a 
        href="/" 
        class="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        Volver al Inicio
      </a>
    </div>
  </div>
</div> 
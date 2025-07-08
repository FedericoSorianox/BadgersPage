<script lang="ts">
  import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
  import { supabase } from '$lib/supabaseClient';

  let connectionTest = 'Pendiente...';
  let tableTest = 'Pendiente...';

  async function testConnection() {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) {
        connectionTest = `Error: ${error.message}`;
      } else {
        connectionTest = 'Conexión exitosa';
      }
    } catch (err) {
      connectionTest = `Excepción: ${err}`;
    }
  }

  async function testTable() {
    try {
      const { data, error } = await supabase.from('profiles').select('*').limit(5);
      if (error) {
        tableTest = `Error: ${error.message}`;
      } else {
        tableTest = `Tabla encontrada. Registros: ${data?.length || 0}`;
      }
    } catch (err) {
      tableTest = `Excepción: ${err}`;
    }
  }
</script>

<div class="container mx-auto p-8">
  <h1 class="text-3xl font-bold mb-8">Verificación de Variables de Entorno</h1>

  <div class="space-y-6">
    <div class="bg-gray-100 p-4 rounded">
      <h2 class="text-xl font-semibold mb-2">Variables de Entorno</h2>
      <div class="space-y-2">
        <p><strong>SUPABASE_URL:</strong> {PUBLIC_SUPABASE_URL ? '✅ Configurada' : '❌ No configurada'}</p>
        <p><strong>SUPABASE_ANON_KEY:</strong> {PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada'}</p>
      </div>
    </div>

    <div class="bg-gray-100 p-4 rounded">
      <h2 class="text-xl font-semibold mb-2">Pruebas de Conexión</h2>
      <div class="space-y-4">
        <div>
          <p><strong>Conexión a Supabase:</strong> {connectionTest}</p>
          <button on:click={testConnection} class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2">
            Probar Conexión
          </button>
        </div>
        <div>
          <p><strong>Tabla profiles:</strong> {tableTest}</p>
          <button on:click={testTable} class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2">
            Probar Tabla
          </button>
        </div>
      </div>
    </div>

    <div class="bg-gray-100 p-4 rounded">
      <h2 class="text-xl font-semibold mb-2">Acciones</h2>
      <div class="space-x-4">
        <a href="/debug" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
          Ir a Debug
        </a>
        <a href="/admin" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Ir a Admin
        </a>
      </div>
    </div>
  </div>
</div> 
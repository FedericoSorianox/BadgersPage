<script lang="ts">
  export let data;

  $: products = data.products;
</script>

<div class="space-y-8">
  <div>
    <h1 class="text-3xl font-bold">Panel de Administrador</h1>
    <p class="text-gray-600 mt-2">Bienvenido! Solo los administradores pueden ver esta página.</p>
  </div>

  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold">Gestionar Usuarios</h2>
      <a
        href="/admin/create-user"
        class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        Crear Nuevo Usuario
      </a>
    </div>
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold">Gestionar Productos</h2>
      <a
        href="/admin/products/new"
        class="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
      >
        Nuevo Producto
      </a>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="overflow-x-auto">
        <table class="w-full text-left table-auto">
          <thead>
            <tr class="bg-gray-200 text-gray-600">
              <th class="px-4 py-2">#</th>
              <th class="px-4 py-2">Nombre</th>
              <th class="px-4 py-2">Descripción</th>
              <th class="px-4 py-2">Precio</th>
              <th class="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {#each products as product, i}
              <tr class="border-b">
                <td class="px-4 py-2">{i + 1}</td>
                <td class="px-4 py-2">{product.name}</td>
                <td class="px-4 py-2">{product.description}</td>
                <td class="px-4 py-2">${product.price}</td>
                <td class="px-4 py-2">
                  <a href="/admin/products/{product.id}" class="text-blue-600 hover:underline">
                    Editar
                  </a>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
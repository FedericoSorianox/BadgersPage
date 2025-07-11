<script lang="ts">
  import type { PageData } from './$types';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import SocioDetails from './SocioDetails.svelte';
  import AddSocioForm from './AddSocioForm.svelte';

  export let data: PageData;

  let showDetails = false;
  let showAddForm = false;
  let selectedSocio: any = null;
  let editMode = false;
  let searchTerm = '';

  $: filteredSocios = searchTerm
    ? data.socios.filter(socio => {
        const search = searchTerm.toLowerCase();
        const name = socio.name ? socio.name.toLowerCase() : '';
        const ci = socio.ci ? socio.ci.toLowerCase() : '';
        return name.includes(search) || ci.includes(search);
      })
    : data.socios;

  function viewSocio(socio: any) {
    selectedSocio = socio;
    editMode = false;
    showDetails = true;
  }

  function editSocio(socio: any) {
    selectedSocio = socio;
    editMode = true;
    showDetails = true;
  }

  function openAddForm() {
    showAddForm = true;
  }

  // Lógica futura para búsqueda y modales
</script>

<div class="container mx-auto p-4 space-y-6">
  <div class="flex justify-between items-center">
    <h1 class="text-3xl font-bold">Socios</h1>
    <Button on:click={openAddForm}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
      Agregar Socio
    </Button>
  </div>

  <div>
    <Input placeholder="Buscar por nombre o CI..." bind:value={searchTerm} />
  </div>

  <!-- Contenedor de la tabla/lista de socios -->
  <div class="bg-white p-6 rounded-lg shadow-md">
    <div class="overflow-x-auto">
      <table class="w-full text-left table-auto">
        <thead>
          <tr class="bg-gray-100 text-gray-600">
            <th class="px-4 py-2">FOTO</th>
            <th class="px-4 py-2">CI</th>
            <th class="px-4 py-2">NOMBRE</th>
            <th class="px-4 py-2">CELULAR</th>
            <th class="px-4 py-2">TIPO DE CUOTA</th>
            <th class="px-4 py-2">ESTADO</th>
            <th class="px-4 py-2 text-center">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {#if data.socios.length > 0}
            {#each filteredSocios as socio}
              <tr
                class="border-b hover:bg-gray-50 cursor-pointer"
                on:click={() => viewSocio(socio)}
                on:keydown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    viewSocio(socio);
                  }
                }}
                role="button"
                tabindex="0"
              >
                <td class="px-4 py-2">
                  <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {#if socio.photo_url}
                      <img src={socio.photo_url} alt="Foto de {socio.name}" class="w-full h-full object-cover" />
                    {:else}
                      <!-- Placeholder para foto -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    {/if}
                  </div>
                </td>
                <td class="px-4 py-2">{socio.ci}</td>
                <td class="px-4 py-2 font-medium">{socio.name}</td>
                <td class="px-4 py-2">{socio.phone}</td>
                <td class="px-4 py-2">{socio.membership_type}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {#if socio.status}
                    <span
                      class="px-3 py-1 text-sm font-semibold rounded-full"
                      class:bg-green-100={socio.status === 'Activo'}
                      class:text-green-800={socio.status === 'Activo'}
                      class:bg-yellow-100={socio.status === 'Inactive'}
                      class:text-yellow-800={socio.status === 'Inactive'}
                      class:bg-gray-100={socio.status !== 'Activo' && socio.status !== 'Inactive'}
                      class:text-gray-800={socio.status !== 'Activo' && socio.status !== 'Inactive'}
                    >
                      {socio.status === 'Inactive' ? 'Inactivo' : socio.status}
                    </span>
                  {:else}
                    <span class="text-gray-500">N/A</span>
                  {/if}
                </td>
                <td class="px-4 py-2">
                  <div class="flex justify-center items-center space-x-2" role="group">
                    <Button
                      variant="outline"
                      size="icon"
                      title="Ver Detalles"
                      on:click={(e) => {
                        e.stopPropagation();
                        viewSocio(socio);
                      }}>👁️</Button
                    >
                    <Button
                      variant="outline"
                      size="icon"
                      title="Editar"
                      on:click={(e) => {
                        e.stopPropagation();
                        editSocio(socio);
                      }}>✏️</Button
                    >
                    <div on:click|stopPropagation>
                      <form
                        method="POST"
                        action="?/deleteSocio"
                        on:submit={(e) => {
                          if (!confirm('¿Estás seguro de que quieres eliminar este socio? Esta acción es irreversible.')) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="id" value={socio.id} />
                        <input type="hidden" name="user_id" value={socio.user_id} />
                        <Button type="submit" variant="destructive" size="icon" title="Eliminar">🗑️</Button>
                      </form>
                    </div>
                  </div>
                </td>
              </tr>
            {/each}
          {:else}
            <tr>
              <td colspan="7" class="text-center p-8 text-gray-500">
                No hay socios para mostrar.
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>

<SocioDetails bind:show={showDetails} socio={selectedSocio} bind:editMode />
<AddSocioForm bind:show={showAddForm} /> 
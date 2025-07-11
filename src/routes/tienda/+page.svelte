<script lang="ts">
  import { formatCurrency } from '$lib/utils';
  import { onMount } from 'svelte';
  export let data;

  let showModal = false;
  let selectedImageUrl = '';

  function openModal(imageUrl: string) {
    selectedImageUrl = imageUrl;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (showModal && e.key === 'Escape') {
      closeModal();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

{#if showModal}
  <div
    class="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
    role="dialog"
    aria-modal="true"
  >
    <button
      class="fixed inset-0 w-full h-full cursor-default"
      on:click={closeModal}
      tabindex="-1"
      aria-label="Cerrar modal"
    />
    <div class="relative p-4 bg-white rounded-lg z-10">
      <img src={selectedImageUrl} alt="Producto ampliado" class="max-w-[80vw] max-h-[80vh]" />
      <button
        on:click={closeModal}
        class="absolute -top-4 -right-4 text-white bg-gray-800 rounded-full h-8 w-8 flex items-center justify-center text-lg"
        aria-label="Cerrar modal"
      >
        &times;
      </button>
    </div>
  </div>
{/if}

<div class="container mx-auto px-4 py-8">
  <div class="text-center mb-12">
    <h1 class="text-4xl md:text-5xl font-extrabold">
      Nuestra <span class="text-primary">Tienda</span>
    </h1>
    <p class="text-lg text-gray-600 mt-2">Equipamiento oficial de The Badgers.</p>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {#each data.products as product (product.id)}
      <div class="card bg-base-100 shadow-xl border flex flex-col">
        <figure class="px-10 pt-10 aspect-square">
          <button on:click={() => openModal(product.img_url)} class="cursor-pointer h-full w-full">
            <img
              src={product.img_url}
              alt={product.nombre}
              class="h-full w-full object-contain"
            />
          </button>
        </figure>
        <div class="card-body items-center text-center flex-grow">
          <h2 class="card-title">{product.nombre}</h2>
          <p class="text-lg font-semibold text-primary">{formatCurrency(product.precio)}</p>
        </div>
      </div>
    {:else}
      <div class="col-span-full text-center py-16">
        <p class="text-xl text-gray-500">No hay productos disponibles en este momento.</p>
      </div>
    {/each}
  </div>
</div>
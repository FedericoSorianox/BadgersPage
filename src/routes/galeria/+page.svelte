<script lang="ts">
  import { page } from '$app/stores';
  import { enhance } from '$app/forms';
  import type { ActionData, PageData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  $: session = $page.data.session;
  $: galleryItems = data.gallery;
  $: profile = $page.data.profile;

  let uploading = false;
  let dialog: HTMLDialogElement;
  let selectedItem: PageData['gallery'][0] | null = null;
  let videoElement: HTMLVideoElement;

  function isVideo(fileName: string): boolean {
    if (!fileName) return false;
    const videoExtensions = ['.mp4', '.mov', '.webm'];
    const lowerCaseName = fileName.toLowerCase();
    return videoExtensions.some((ext) => lowerCaseName.endsWith(ext));
  }

  function openDialog(item: PageData['gallery'][0]) {
    selectedItem = item;
    dialog?.showModal();
  }

  function closeDialog(event: MouseEvent) {
    if (event.target === dialog) {
      dialog.close();
    }
  }

  function handleDialogClose() {
    if (videoElement) {
      videoElement.pause();
    }
  }
</script>

<div class="container mx-auto px-4 py-16">
  <div class="text-center mb-12">
    <h1 class="text-4xl md:text-5xl font-extrabold">
      Nuestra <span class="text-badger-accent">Galería</span>
    </h1>
    <p class="text-lg text-gray-600 mt-2">Un vistazo a nuestra comunidad en acción.</p>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {#each galleryItems as item}
      <div
        class="group relative cursor-pointer"
        role="button"
        tabindex="0"
        on:click={() => openDialog(item)}
        on:keydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            openDialog(item);
          }
        }}
      >
        {#if isVideo(item.file_name)}
          <video
            src={item.url}
            class="aspect-square w-full h-full object-cover rounded-lg shadow-md"
            controls
          >
            <track kind="captions" />
          </video>
        {:else}
          <img
            src={item.url}
            alt={item.title || item.file_name}
            class="aspect-square w-full h-full object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
          />
        {/if}
      </div>
    {/each}
  </div>

  {#if session}
    <div class="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-4">Subir a la Galería</h2>
      <form
        method="POST"
        action="?/upload"
        enctype="multipart/form-data"
        use:enhance={() => {
          uploading = true;
          return async ({ update }) => {
            await update();
            uploading = false;
          };
        }}
      >
        <label for="file-upload" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Subir fotos o videos mp4 hasta 50 mb</label
        >
        <input
          type="file"
          id="file-upload"
          name="file"
          accept="image/png, image/jpeg, video/mp4"
          class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          required
          disabled={uploading}
        />
        <label for="title" class="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Título</label
        >
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Un título para la imagen..."
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          disabled={uploading}
        />
        <button
          type="submit"
          class="mt-4 px-4 py-2 bg-badger-accent text-badger-dark font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
          disabled={uploading}
        >
          {#if uploading}
            <svg
              aria-hidden="true"
              class="inline w-5 h-5 mr-2 animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 28.0001 72.5987 9.68021 50 9.68021C27.4013 9.68021 9.08144 28.0001 9.08144 50.5908Z"
                fill="rgba(0,0,0,0.2)"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5424 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            Subiendo...
          {:else}
            Subir
          {/if}
        </button>
      </form>
      {#if form?.message}
        <p
          class="mt-2 text-sm"
          class:text-green-600={form?.success}
          class:text-red-600={!form?.success}
        >
          {form.message}
        </p>
      {/if}
    </div>
  {/if}
</div>

<dialog bind:this={dialog} on:close={handleDialogClose} class="bg-transparent p-0">
  <div class="max-w-screen-xl max-h-screen relative">
    <button
      on:click={closeDialog}
      class="fixed inset-0 w-full h-full bg-transparent cursor-default"
      aria-label="Close dialog"
    />
    <div class="relative">
      <button
        on:click={() => dialog.close()}
        class="absolute -top-10 -right-2 text-white text-4xl bg-black bg-opacity-50 rounded-full px-3 py-1 z-10"
        aria-label="Close"
      >
        &times;
      </button>
      {#if selectedItem}
        {#if isVideo(selectedItem.file_name)}
          <video
            bind:this={videoElement}
            src={selectedItem.url}
            class="max-h-screen"
            controls
            autoplay
          >
            <track kind="captions" />
          </video>
        {:else}
          <img
            src={selectedItem.url}
            alt={selectedItem.title || selectedItem.file_name}
            class="max-h-screen"
          />
        {/if}
        <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4 text-center">
          <p class="font-bold">{selectedItem.title || selectedItem.file_name}</p>
          {#if selectedItem.clients?.name}
            <p class="text-sm italic">Subido por: {selectedItem.clients.name}</p>
          {/if}
        </div>

        {#if profile?.role === 'admin'}
          <form method="POST" action="?/delete" use:enhance class="absolute top-2 left-2 z-10">
            <input type="hidden" name="id" value={selectedItem.id} />
            <input type="hidden" name="storage_path" value={selectedItem.storage_path} />
            <button
              type="submit"
              class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
              aria-label="Delete item"
            >
              Borrar
            </button>
          </form>
        {/if}
      {/if}
    </div>
  </div>
</dialog>

<style>
  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.8);
  }
  dialog[open] {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
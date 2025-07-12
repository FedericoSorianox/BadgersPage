import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // Elimina completamente la configuración de 'routes' del adaptador
    adapter: adapter() // <--- Deja el adaptador sin opciones, o con las que realmente necesites
  },
  preprocess: vitePreprocess()
};

export default config;
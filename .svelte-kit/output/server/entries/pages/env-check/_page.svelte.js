import { c as create_ssr_component, e as escape } from "../../../chunks/ssr.js";
import "../../../chunks/supabaseClient.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let connectionTest = "Pendiente...";
  let tableTest = "Pendiente...";
  return `<div class="container mx-auto p-8"><h1 class="text-3xl font-bold mb-8" data-svelte-h="svelte-1antsb">Verificación de Variables de Entorno</h1> <div class="space-y-6"><div class="bg-gray-100 p-4 rounded"><h2 class="text-xl font-semibold mb-2" data-svelte-h="svelte-zgxz1r">Variables de Entorno</h2> <div class="space-y-2"><p><strong data-svelte-h="svelte-ubozlc">SUPABASE_URL:</strong> ${escape(
    "✅ Configurada"
  )}</p> <p><strong data-svelte-h="svelte-ihokah">SUPABASE_ANON_KEY:</strong> ${escape(
    "✅ Configurada"
  )}</p></div></div> <div class="bg-gray-100 p-4 rounded"><h2 class="text-xl font-semibold mb-2" data-svelte-h="svelte-10b0vsc">Pruebas de Conexión</h2> <div class="space-y-4"><div><p><strong data-svelte-h="svelte-12zczpy">Conexión a Supabase:</strong> ${escape(connectionTest)}</p> <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2" data-svelte-h="svelte-1s3je64">Probar Conexión</button></div> <div><p><strong data-svelte-h="svelte-k8c5nq">Tabla profiles:</strong> ${escape(tableTest)}</p> <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2" data-svelte-h="svelte-1iy3lt3">Probar Tabla</button></div></div></div> <div class="bg-gray-100 p-4 rounded" data-svelte-h="svelte-799lko"><h2 class="text-xl font-semibold mb-2">Acciones</h2> <div class="space-x-4"><a href="/debug" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">Ir a Debug</a> <a href="/admin" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Ir a Admin</a></div></div></div></div>`;
});
export {
  Page as default
};

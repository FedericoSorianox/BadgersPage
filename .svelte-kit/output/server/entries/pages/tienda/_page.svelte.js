import { c as create_ssr_component, d as each, a as add_attribute, e as escape } from "../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  return `<div class="container mx-auto px-4 py-16"><div class="text-center mb-12" data-svelte-h="svelte-1h7m14c"><h1 class="text-4xl md:text-5xl font-extrabold">Nuestra <span class="text-badger-accent">Tienda</span></h1> <p class="text-lg text-gray-600 mt-2">Equipamiento oficial de The Badgers.</p></div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">${each(data.productos, (producto) => {
    return `<div class="bg-white border rounded-lg shadow-lg overflow-hidden flex flex-col"><img${add_attribute("src", producto.imagen, 0)}${add_attribute("alt", producto.nombre, 0)} class="w-full h-64 object-cover"> <div class="p-6 flex flex-col flex-grow"><div class="flex justify-between items-start mb-2"><h3 class="text-xl font-bold text-badger-dark">${escape(producto.nombre)}</h3> <span class="text-xl font-semibold text-badger-accent">$${escape(producto.precio)}</span></div> <p class="text-gray-600 mb-4 flex-grow">${escape(producto.descripcion)}</p> <button class="mt-auto w-full bg-badger-dark text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all" data-svelte-h="svelte-ais1u2">Añadir al Carrito
          </button></div> </div>`;
  })}</div></div>`;
});
export {
  Page as default
};

import { c as create_ssr_component, a as add_attribute, v as validate_component, e as escape } from "../../chunks/ssr.js";
const logo = "/_app/immutable/assets/logo-header.CRJodT6Z.png";
const Navbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<header class="bg-badger-dark text-badger-light shadow-md sticky top-0 z-50" data-svelte-h="svelte-1ijg1ah"><nav class="container mx-auto px-6 py-3 flex justify-between items-center"><a href="/" class="flex items-center"><img${add_attribute("src", logo, 0)} alt="Logo The Badgers" class="h-12 mr-3"> <span class="font-bold text-xl hidden md:block">The Badgers</span></a> <ul class="flex items-center space-x-6"><li><a href="/sobre-nosotros" class="hover:text-badger-accent transition-colors">Sobre Nosotros</a></li> <li><a href="/clases" class="hover:text-badger-accent transition-colors">Clases</a></li> <li><a href="/galeria" class="hover:text-badger-accent transition-colors">Galería</a></li> <li><a href="/tienda" class="hover:text-badger-accent transition-colors">Tienda</a></li> <li><a href="/login" class="hover:text-badger-accent transition-colors">Login</a></li> <li><a href="/contacto" class="bg-badger-accent text-badger-dark font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">Contacto</a></li></ul></nav></header>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="flex flex-col min-h-screen bg-gray-50">${validate_component(Navbar, "Navbar").$$render($$result, {}, {}, {})} <main class="flex-grow">${slots.default ? slots.default({}) : ``}</main> <footer class="bg-badger-dark text-badger-light text-center p-4"><p>© ${escape((/* @__PURE__ */ new Date()).getFullYear())} The Badgers. Todos los derechos reservados.</p> <p class="text-sm mt-2" data-svelte-h="svelte-joa06j">Ciudad de la Costa, Uruguay</p></footer></div>`;
});
export {
  Layout as default
};

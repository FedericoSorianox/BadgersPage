

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/galeria/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.DSBxjYAM.js","_app/immutable/chunks/A-LiUoMI.js","_app/immutable/chunks/D6YF6ztN.js","_app/immutable/chunks/IHki7fMi.js","_app/immutable/chunks/B2sqbLUl.js"];
export const stylesheets = ["_app/immutable/assets/10.BvPC2QbS.css"];
export const fonts = [];

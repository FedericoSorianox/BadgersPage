import * as server from '../entries/pages/tienda/_page.server.ts.js';

export const index = 13;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/tienda/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/tienda/+page.server.ts";
export const imports = ["_app/immutable/nodes/13.CdEXjwf4.js","_app/immutable/chunks/A-LiUoMI.js","_app/immutable/chunks/D6YF6ztN.js","_app/immutable/chunks/IHki7fMi.js"];
export const stylesheets = [];
export const fonts = [];

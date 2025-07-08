import * as server from '../entries/pages/admin/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/admin/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/admin/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.Cpk1CfoX.js","_app/immutable/chunks/A-LiUoMI.js","_app/immutable/chunks/IHki7fMi.js","_app/immutable/chunks/B3yLMbad.js","_app/immutable/chunks/B2sqbLUl.js","_app/immutable/chunks/DJAy97j8.js","_app/immutable/chunks/C1FmrZbK.js"];
export const stylesheets = [];
export const fonts = [];

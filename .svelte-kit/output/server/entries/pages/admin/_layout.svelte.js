import { c as create_ssr_component } from "../../../chunks/ssr.js";
import "../../../chunks/client.js";
import "../../../chunks/supabaseClient.js";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  return `${`${`<div class="text-center p-16" data-svelte-h="svelte-k8hadl"><p>Verificando acceso...</p></div>`}`}`;
});
export {
  Layout as default
};

import { c as create_ssr_component, f as compute_rest_props, h as spread, i as escape_object, o as onDestroy, a as add_attribute, j as createEventDispatcher, b as subscribe, e as escape, v as validate_component, k as compute_slots, d as each } from "../../../chunks/ssr.js";
import { w as writable } from "../../../chunks/index.js";
const css$5 = {
  code: "div.svelte-hpqpx9{position:static;cursor:zoom-in}.svelte-lightbox-thumbnail > *{max-width:100%;height:auto}",
  map: '{"version":3,"file":"LightboxThumbnail.svelte","sources":["LightboxThumbnail.svelte"],"sourcesContent":["<div class:svelte-lightbox-thumbnail={true} aria-label=\\"thumbnail\\" on:click {...$$restProps}>\\n    <slot/>\\n</div>\\n\\n<style>\\n    div {\\n        position: static;\\n        cursor: zoom-in;\\n    }\\n    :global(.svelte-lightbox-thumbnail > *) {\\n        max-width: 100%;\\n        height: auto;\\n    }\\n</style>"],"names":[],"mappings":"AAKI,iBAAI,CACA,QAAQ,CAAE,MAAM,CAChB,MAAM,CAAE,OACZ,CACQ,8BAAgC,CACpC,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,IACZ"}'
};
const LightboxThumbnail = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  $$result.css.add(css$5);
  return `<div${spread([{ "aria-label": "thumbnail" }, escape_object($$restProps)], {
    classes: "svelte-lightbox-thumbnail svelte-hpqpx9"
  })}>${slots.default ? slots.default({}) : ``} </div>`;
});
const BodyChild = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  let targetElement;
  let child;
  const removeTarget = () => {
    if (typeof document !== "undefined") {
      document.body.removeChild(child);
    }
  };
  onDestroy(removeTarget);
  return `<div${spread([escape_object($$restProps)], {})}${add_attribute("this", targetElement, 0)}>${slots.default ? slots.default({}) : ``}</div>`;
});
const css$4 = {
  code: "div.svelte-lightbox-header.svelte-5qj430{width:auto;height:3rem;display:flex;justify-content:flex-end;align-items:center}div.svelte-lightbox-header.fullscreen.svelte-5qj430{position:fixed;z-index:5;top:0;left:0;right:0}button.svelte-5qj430{background:transparent;font-size:3rem;border:none;color:white}button.svelte-5qj430:hover{color:lightgray;cursor:pointer}button.svelte-5qj430:active{background-color:transparent}button.fullscreen.svelte-5qj430{filter:drop-shadow(0 0 5px black) drop-shadow(0 0 10px black)}",
  map: `{"version":3,"file":"LightboxHeader.svelte","sources":["LightboxHeader.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { createEventDispatcher } from \\"svelte\\";\\nconst dispatch = createEventDispatcher();\\nexport let closeButtonProps = {};\\nexport let showCloseButton;\\nexport let enableEscapeToClose;\\nexport let imagePreset;\\nconst handleKey = (event) => {\\n  if (enableEscapeToClose && event.key === \\"Escape\\") {\\n    dispatch(\\"close\\");\\n  }\\n};\\n<\/script>\\n\\n<svelte:window on:keydown={ (event) => handleKey(event) }/>\\n\\n<div class=\\"svelte-lightbox-header\\" class:fullscreen={imagePreset === 'fullscreen'} {...$$restProps}>\\n    {#if showCloseButton}\\n        <button class:fullscreen={imagePreset === 'fullscreen'} on:click={ () => dispatch('close')} {...closeButtonProps}>\\n            ×\\n        </button>\\n    {/if}\\n</div>\\n\\n<style>\\n    div.svelte-lightbox-header {\\n        width: auto;\\n        height: 3rem;\\n        display: flex;\\n        justify-content: flex-end;\\n        align-items: center;\\n    }\\n    div.svelte-lightbox-header.fullscreen {\\n\\t    position: fixed;\\n\\t    z-index: 5;\\n\\t    top: 0;\\n\\t    left: 0;\\n\\t    right: 0;\\n    }\\n    button {\\n        background: transparent;\\n        font-size: 3rem;\\n        border: none;\\n        color: white;\\n    }\\n    button:hover {\\n        color: lightgray;\\n        cursor: pointer;\\n    }\\n    button:active {\\n\\t    background-color: transparent;\\n    }\\n    button.fullscreen {\\n\\t    filter: drop-shadow(0 0 5px black) drop-shadow(0 0 10px black);\\n    }\\n</style>\\n"],"names":[],"mappings":"AAwBI,GAAG,qCAAwB,CACvB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,QAAQ,CACzB,WAAW,CAAE,MACjB,CACA,GAAG,uBAAuB,yBAAY,CACrC,QAAQ,CAAE,KAAK,CACf,OAAO,CAAE,CAAC,CACV,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CACR,CACA,oBAAO,CACH,UAAU,CAAE,WAAW,CACvB,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,KACX,CACA,oBAAM,MAAO,CACT,KAAK,CAAE,SAAS,CAChB,MAAM,CAAE,OACZ,CACA,oBAAM,OAAQ,CACb,gBAAgB,CAAE,WACnB,CACA,MAAM,yBAAY,CACjB,MAAM,CAAE,YAAY,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,YAAY,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,KAAK,CAC9D"}`
};
const LightboxHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["closeButtonProps", "showCloseButton", "enableEscapeToClose", "imagePreset"]);
  createEventDispatcher();
  let { closeButtonProps = {} } = $$props;
  let { showCloseButton } = $$props;
  let { enableEscapeToClose } = $$props;
  let { imagePreset } = $$props;
  if ($$props.closeButtonProps === void 0 && $$bindings.closeButtonProps && closeButtonProps !== void 0) $$bindings.closeButtonProps(closeButtonProps);
  if ($$props.showCloseButton === void 0 && $$bindings.showCloseButton && showCloseButton !== void 0) $$bindings.showCloseButton(showCloseButton);
  if ($$props.enableEscapeToClose === void 0 && $$bindings.enableEscapeToClose && enableEscapeToClose !== void 0) $$bindings.enableEscapeToClose(enableEscapeToClose);
  if ($$props.imagePreset === void 0 && $$bindings.imagePreset && imagePreset !== void 0) $$bindings.imagePreset(imagePreset);
  $$result.css.add(css$4);
  return ` <div${spread([{ class: "svelte-lightbox-header" }, escape_object($$restProps)], {
    classes: (imagePreset === "fullscreen" ? "fullscreen" : "") + " svelte-5qj430"
  })}>${showCloseButton ? `<button${spread([escape_object(closeButtonProps)], {
    classes: (imagePreset === "fullscreen" ? "fullscreen" : "") + " svelte-5qj430"
  })}>×</button>` : ``} </div>`;
});
const css$3 = {
  code: "div.svelte-lightbox-body.svelte-fqwdsi{position:relative;width:auto;height:auto;max-height:80vh}div.svelte-lightbox-body > *{max-width:100%;max-height:inherit;height:auto;width:auto;-o-object-fit:contain;object-fit:contain}div.svelte-lightbox-body.scroll > *{max-height:100%}div.svelte-lightbox-body.expand > *{flex-grow:1}div.fullscreen.svelte-fqwdsi{width:inherit;max-width:inherit;height:inherit;max-height:100%;display:flex;align-items:center;justify-content:center}div.scroll.svelte-fqwdsi{overflow:scroll}",
  map: `{"version":3,"file":"LightboxBody.svelte","sources":["LightboxBody.svelte"],"sourcesContent":["<script lang=\\"ts\\">export let imagePreset;\\nexport let enableImageExpand;\\n<\/script>\\n\\n<div class=\\"svelte-lightbox-body\\" class:fullscreen={imagePreset === 'fullscreen'} class:scroll={imagePreset === 'scroll'}\\n\\t class:expand={enableImageExpand}>\\n\\t<slot/>\\n</div>\\n\\n<style>\\n    div.svelte-lightbox-body {\\n\\t\\tposition: relative;\\n        width: auto;\\n        height: auto;\\n\\t\\t/* TODO: mitigate this hardcode by using flexbox in lightbox modal <Modal.svelte> */\\n        max-height: 80vh;\\n    }\\n\\t:global(div.svelte-lightbox-body > *) {\\n\\t\\tmax-width: 100%;\\n\\t\\tmax-height: inherit;\\n\\t\\theight: auto;\\n\\t\\twidth: auto;\\n\\t\\t-o-object-fit: contain;\\n\\t\\t   object-fit: contain;\\n\\t}\\n\\t:global(div.svelte-lightbox-body.scroll > *) {\\n\\t\\tmax-height: 100%;\\n\\t}\\n\\t:global(div.svelte-lightbox-body.expand > *) {\\n\\t\\tflex-grow: 1;\\n\\t}\\n    div.fullscreen {\\n        width: inherit;\\n\\t    max-width: inherit;\\n        height: inherit;\\n\\t\\tmax-height: 100%;\\n\\t\\tdisplay: flex;\\n\\t\\talign-items: center;\\n\\t\\tjustify-content: center;\\n    }\\n    div.scroll {\\n\\t\\toverflow: scroll;\\n    }\\n</style>"],"names":[],"mappings":"AAUI,GAAG,mCAAsB,CAC3B,QAAQ,CAAE,QAAQ,CACZ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CAEZ,UAAU,CAAE,IAChB,CACK,4BAA8B,CACrC,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,OAAO,CACnB,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,aAAa,CAAE,OAAO,CACnB,UAAU,CAAE,OAChB,CACQ,mCAAqC,CAC5C,UAAU,CAAE,IACb,CACQ,mCAAqC,CAC5C,SAAS,CAAE,CACZ,CACG,GAAG,yBAAY,CACX,KAAK,CAAE,OAAO,CACjB,SAAS,CAAE,OAAO,CACf,MAAM,CAAE,OAAO,CACrB,UAAU,CAAE,IAAI,CAChB,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MACf,CACA,GAAG,qBAAQ,CACb,QAAQ,CAAE,MACR"}`
};
const LightboxBody = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { imagePreset } = $$props;
  let { enableImageExpand } = $$props;
  if ($$props.imagePreset === void 0 && $$bindings.imagePreset && imagePreset !== void 0) $$bindings.imagePreset(imagePreset);
  if ($$props.enableImageExpand === void 0 && $$bindings.enableImageExpand && enableImageExpand !== void 0) $$bindings.enableImageExpand(enableImageExpand);
  $$result.css.add(css$3);
  return `<div class="${[
    "svelte-lightbox-body svelte-fqwdsi",
    (imagePreset === "fullscreen" ? "fullscreen" : "") + " " + (imagePreset === "scroll" ? "scroll" : "") + " " + (enableImageExpand ? "expand" : "")
  ].join(" ").trim()}">${slots.default ? slots.default({}) : ``} </div>`;
});
const i18n = writable({
  generateLocalizedGalleryCounter: (activeImage, imageCount) => {
    return `Image ${activeImage + 1} of ${imageCount}`;
  }
});
const css$2 = {
  code: "div.svelte-lightbox-footer.svelte-6fc1ka{width:100%;height:auto;color:white;text-align:left;position:absolute}div.svelte-lightbox-footer.fullscreen.svelte-6fc1ka{position:fixed;z-index:5;bottom:0;left:0;right:0;padding-left:1rem}",
  map: `{"version":3,"file":"LightboxFooter.svelte","sources":["LightboxFooter.svelte"],"sourcesContent":["<script lang=\\"ts\\">import i18n from \\"../i18n\\";\\nexport let imagePreset;\\nexport let title = \\"\\";\\nexport let description = \\"\\";\\nexport let gallery = null;\\nconst generateLocalizedGalleryCounter = (i18n2, gallery2) => {\\n  if (gallery2 !== null) {\\n    return i18n2.generateLocalizedGalleryCounter(gallery2.activeImage, gallery2.imageCount);\\n  }\\n};\\n$: localizedGalleryCounter = generateLocalizedGalleryCounter($i18n, gallery);\\n<\/script>\\n\\n<div class=\\"svelte-lightbox-footer\\" class:fullscreen={imagePreset === 'fullscreen'} {...$$restProps}>\\n    <h2>\\n        {title}\\n    </h2>\\n    <h5>\\n        {description}\\n    </h5>\\n    {#if gallery !== null}\\n        <p>\\n            {localizedGalleryCounter}\\n        </p>\\n    {/if}\\n</div>\\n\\n<style>\\n    div.svelte-lightbox-footer {\\n        width: 100%;\\n        height: auto;\\n        color: white;\\n        text-align: left;\\n        position: absolute;\\n    }\\n    div.svelte-lightbox-footer.fullscreen {\\n        position: fixed;\\n        z-index: 5;\\n        bottom: 0;\\n        left: 0;\\n        right: 0;\\n        padding-left: 1rem;\\n    }\\n</style>\\n"],"names":[],"mappings":"AA4BI,GAAG,qCAAwB,CACvB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,KAAK,CACZ,UAAU,CAAE,IAAI,CAChB,QAAQ,CAAE,QACd,CACA,GAAG,uBAAuB,yBAAY,CAClC,QAAQ,CAAE,KAAK,CACf,OAAO,CAAE,CAAC,CACV,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CAAC,CACR,YAAY,CAAE,IAClB"}`
};
const LightboxFooter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let localizedGalleryCounter;
  let $$restProps = compute_rest_props($$props, ["imagePreset", "title", "description", "gallery"]);
  let $i18n, $$unsubscribe_i18n;
  $$unsubscribe_i18n = subscribe(i18n, (value) => $i18n = value);
  let { imagePreset } = $$props;
  let { title = "" } = $$props;
  let { description = "" } = $$props;
  let { gallery = null } = $$props;
  const generateLocalizedGalleryCounter = (i18n2, gallery2) => {
    if (gallery2 !== null) {
      return i18n2.generateLocalizedGalleryCounter(gallery2.activeImage, gallery2.imageCount);
    }
  };
  if ($$props.imagePreset === void 0 && $$bindings.imagePreset && imagePreset !== void 0) $$bindings.imagePreset(imagePreset);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  if ($$props.description === void 0 && $$bindings.description && description !== void 0) $$bindings.description(description);
  if ($$props.gallery === void 0 && $$bindings.gallery && gallery !== void 0) $$bindings.gallery(gallery);
  $$result.css.add(css$2);
  localizedGalleryCounter = generateLocalizedGalleryCounter($i18n, gallery);
  $$unsubscribe_i18n();
  return `<div${spread([{ class: "svelte-lightbox-footer" }, escape_object($$restProps)], {
    classes: (imagePreset === "fullscreen" ? "fullscreen" : "") + " svelte-6fc1ka"
  })}><h2>${escape(title)}</h2> <h5>${escape(description)}</h5> ${gallery !== null ? `<p>${escape(localizedGalleryCounter)}</p>` : ``} </div>`;
});
const css$1 = {
  code: `div.svelte-lightbox-overlay.svelte-7wg54p{position:fixed;z-index:1000000!important;background-color:rgba(43, 39, 45, 0.87);top:0;bottom:0;left:0;right:0;overflow:hidden;width:100%;height:100%;display:flex;align-items:center;justify-content:center}div.svelte-lightbox-overlay.svelte-7wg54p::before{content:'';position:absolute;top:0;bottom:0;left:0;right:0;opacity:0;z-index:-1}div.svelte-lightbox-overlay.svelte-7wg54p::after{content:"";clear:both;display:table}`,
  map: `{"version":3,"file":"ModalCover.svelte","sources":["ModalCover.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { fade } from \\"svelte/transition\\";\\nexport let transitionDuration;\\n<\/script>\\n\\n<div class=\\"svelte-lightbox-overlay\\" aria-label=\\"overlay\\" on:click in:fade={{ duration: transitionDuration * 2 }} out:fade={{ duration: transitionDuration / 2 }} {...$$restProps}>\\n    <slot />\\n</div>\\n\\n<style>\\n    div.svelte-lightbox-overlay {\\n        position: fixed;\\n        z-index: 1000000!important;\\n        background-color: rgba(43, 39, 45, 0.87);\\n        top: 0;\\n        bottom: 0;\\n        left: 0;\\n        right: 0;\\n        overflow: hidden;\\n        width: 100%;\\n        height: 100%;\\n        display: flex;\\n        align-items: center;\\n        justify-content: center;\\n    }\\n    div.svelte-lightbox-overlay::before {\\n        content: '';\\n        position: absolute;\\n        top: 0; bottom: 0; left: 0; right: 0;\\n        opacity: 0;\\n        z-index: -1;\\n    }\\n    div.svelte-lightbox-overlay::after {\\n        content: \\"\\";\\n        clear: both;\\n        display: table;\\n    }\\n</style>\\n"],"names":[],"mappings":"AASI,GAAG,sCAAyB,CACxB,QAAQ,CAAE,KAAK,CACf,OAAO,CAAE,OAAO,UAAU,CAC1B,gBAAgB,CAAE,KAAK,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,IAAI,CAAC,CACxC,GAAG,CAAE,CAAC,CACN,MAAM,CAAE,CAAC,CACT,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CAAC,CACR,QAAQ,CAAE,MAAM,CAChB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MACrB,CACA,GAAG,sCAAwB,QAAS,CAChC,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,CAAC,CAAE,MAAM,CAAE,CAAC,CAAE,IAAI,CAAE,CAAC,CAAE,KAAK,CAAE,CAAC,CACpC,OAAO,CAAE,CAAC,CACV,OAAO,CAAE,EACb,CACA,GAAG,sCAAwB,OAAQ,CAC/B,OAAO,CAAE,EAAE,CACX,KAAK,CAAE,IAAI,CACX,OAAO,CAAE,KACb"}`
};
const ModalCover = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["transitionDuration"]);
  let { transitionDuration } = $$props;
  if ($$props.transitionDuration === void 0 && $$bindings.transitionDuration && transitionDuration !== void 0) $$bindings.transitionDuration(transitionDuration);
  $$result.css.add(css$1);
  return `<div${spread(
    [
      { class: "svelte-lightbox-overlay" },
      { "aria-label": "overlay" },
      escape_object($$restProps)
    ],
    { classes: "svelte-7wg54p" }
  )}>${slots.default ? slots.default({}) : ``} </div>`;
});
const css = {
  code: "div.svelte-lightbox-main.svelte-891jqp{position:relative;max-width:100%;max-height:100%;height:auto;width:auto;background-color:transparent}div.svelte-lightbox-main.fullscreen.svelte-891jqp{height:inherit;width:inherit;max-height:inherit;max-width:inherit}",
  map: `{"version":3,"file":"Modal.svelte","sources":["Modal.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { fade } from \\"svelte/transition\\";\\nexport let transitionDuration;\\nexport let imagePreset;\\n<\/script>\\n\\n<div class=\\"svelte-lightbox-main\\" class:fullscreen={imagePreset === 'fullscreen'} class:scroll={imagePreset === 'scroll'}\\n     transition:fade={{ duration: transitionDuration }} aria-label=\\"Modal\\" on:click {...$$restProps}>\\n    <slot/>\\n</div>\\n\\n<style>\\n     div.svelte-lightbox-main {\\n         position: relative;\\n         max-width: 100%;\\n         max-height: 100%;\\n         height: auto;\\n         width: auto;\\n         background-color: transparent;\\n    }\\n     div.svelte-lightbox-main.fullscreen {\\n\\t     height: inherit;\\n\\t     width: inherit;\\n         max-height: inherit;\\n         max-width: inherit;\\n     }\\n</style>"],"names":[],"mappings":"AAWK,GAAG,mCAAsB,CACrB,QAAQ,CAAE,QAAQ,CAClB,SAAS,CAAE,IAAI,CACf,UAAU,CAAE,IAAI,CAChB,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,gBAAgB,CAAE,WACvB,CACC,GAAG,qBAAqB,yBAAY,CACnC,MAAM,CAAE,OAAO,CACf,KAAK,CAAE,OAAO,CACX,UAAU,CAAE,OAAO,CACnB,SAAS,CAAE,OACf"}`
};
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["transitionDuration", "imagePreset"]);
  let { transitionDuration } = $$props;
  let { imagePreset } = $$props;
  if ($$props.transitionDuration === void 0 && $$bindings.transitionDuration && transitionDuration !== void 0) $$bindings.transitionDuration(transitionDuration);
  if ($$props.imagePreset === void 0 && $$bindings.imagePreset && imagePreset !== void 0) $$bindings.imagePreset(imagePreset);
  $$result.css.add(css);
  return `<div${spread(
    [
      { class: "svelte-lightbox-main" },
      { "aria-label": "Modal" },
      escape_object($$restProps)
    ],
    {
      classes: (imagePreset === "fullscreen" ? "fullscreen" : "") + " " + (imagePreset === "scroll" ? "scroll" : "") + " svelte-891jqp"
    }
  )}>${slots.default ? slots.default({}) : ``} </div>`;
});
const Lightbox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$slots = compute_slots(slots);
  let { title = "" } = $$props;
  let { description = "" } = $$props;
  let { imagePreset = "" } = $$props;
  let { customization = {} } = $$props;
  let { transitionDuration = 300 } = $$props;
  let { keepBodyScroll = false } = $$props;
  let { enableImageExpand = false } = $$props;
  let { enableFallbackThumbnail = true } = $$props;
  let { enableEscapeToClose = true } = $$props;
  let { enableClickToClose = false } = $$props;
  let { showCloseButton = true } = $$props;
  let { isVisible = false } = $$props;
  const toggle = () => {
    isVisible = !isVisible;
  };
  const open = () => {
    isVisible = true;
  };
  const close = () => {
    isVisible = false;
  };
  const programmaticController = { toggle, open, close };
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  if ($$props.description === void 0 && $$bindings.description && description !== void 0) $$bindings.description(description);
  if ($$props.imagePreset === void 0 && $$bindings.imagePreset && imagePreset !== void 0) $$bindings.imagePreset(imagePreset);
  if ($$props.customization === void 0 && $$bindings.customization && customization !== void 0) $$bindings.customization(customization);
  if ($$props.transitionDuration === void 0 && $$bindings.transitionDuration && transitionDuration !== void 0) $$bindings.transitionDuration(transitionDuration);
  if ($$props.keepBodyScroll === void 0 && $$bindings.keepBodyScroll && keepBodyScroll !== void 0) $$bindings.keepBodyScroll(keepBodyScroll);
  if ($$props.enableImageExpand === void 0 && $$bindings.enableImageExpand && enableImageExpand !== void 0) $$bindings.enableImageExpand(enableImageExpand);
  if ($$props.enableFallbackThumbnail === void 0 && $$bindings.enableFallbackThumbnail && enableFallbackThumbnail !== void 0) $$bindings.enableFallbackThumbnail(enableFallbackThumbnail);
  if ($$props.enableEscapeToClose === void 0 && $$bindings.enableEscapeToClose && enableEscapeToClose !== void 0) $$bindings.enableEscapeToClose(enableEscapeToClose);
  if ($$props.enableClickToClose === void 0 && $$bindings.enableClickToClose && enableClickToClose !== void 0) $$bindings.enableClickToClose(enableClickToClose);
  if ($$props.showCloseButton === void 0 && $$bindings.showCloseButton && showCloseButton !== void 0) $$bindings.showCloseButton(showCloseButton);
  if ($$props.isVisible === void 0 && $$bindings.isVisible && isVisible !== void 0) $$bindings.isVisible(isVisible);
  if ($$props.programmaticController === void 0 && $$bindings.programmaticController && programmaticController !== void 0) $$bindings.programmaticController(programmaticController);
  return `${$$slots.thumbnail || enableFallbackThumbnail ? `${validate_component(LightboxThumbnail, "Thumbnail").$$render($$result, Object.assign({}, customization?.thumbnailProps || {}), {}, {
    default: () => {
      return `${$$slots.thumbnail ? `${slots.thumbnail ? slots.thumbnail({}) : ``}` : `${slots.default ? slots.default({}) : ``}`}`;
    }
  })}` : ``} ${isVisible ? `${validate_component(BodyChild, "BodyChild").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(ModalCover, "ModalCover").$$render($$result, Object.assign({}, { transitionDuration }, customization.coverProps || {}), {}, {
        default: () => {
          return `${validate_component(Modal, "Modal").$$render($$result, Object.assign({}, { imagePreset }, { transitionDuration }, customization.lightboxProps || {}), {}, {
            default: () => {
              return `${validate_component(LightboxHeader, "Header").$$render(
                $$result,
                Object.assign(
                  {},
                  { imagePreset },
                  { showCloseButton },
                  { enableEscapeToClose },
                  {
                    closeButtonProps: customization.closeButtonProps
                  },
                  customization.lightboxHeaderProps || {}
                ),
                {},
                {}
              )} ${validate_component(LightboxBody, "Body").$$render($$result, { imagePreset, enableImageExpand }, {}, {
                default: () => {
                  return `${slots.default ? slots.default({}) : ``}`;
                }
              })} ${validate_component(LightboxFooter, "Footer").$$render($$result, Object.assign({}, { imagePreset }, { title }, { description }, customization.lightboxFooterProps || {}), {}, {})}`;
            }
          })}`;
        }
      })}`;
    }
  })}` : ``}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const galleryImages = [
    { src: "/gallery/foto1.png", alt: "Team" },
    {
      src: "/gallery/1.jpg",
      alt: "Clase de Muay Thai"
    },
    {
      src: "/gallery/2.jpg",
      alt: "Compañerismo en el tatami"
    },
    {
      src: "/gallery/3.jpg",
      alt: "Técnica de derribo"
    },
    {
      src: "/gallery/4.jpg",
      alt: "Clase de niños"
    },
    {
      src: "/gallery/foto6.jpg",
      alt: "Foto grupal de la academia"
    },
    {
      src: "/gallery/foto7.jpg",
      alt: "Entrenamiento de Boxeo"
    },
    {
      src: "/gallery/foto8.jpg",
      alt: "Open Mat de sábado"
    }
  ];
  return `<div class="container mx-auto px-4 py-16"><div class="text-center mb-12" data-svelte-h="svelte-skask2"><h1 class="text-4xl md:text-5xl font-extrabold">Nuestra <span class="text-badger-accent">Galería</span></h1> <p class="text-lg text-gray-600 mt-2">Un vistazo a nuestra comunidad en acción.</p></div> ${validate_component(Lightbox, "Lightbox").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">${each(galleryImages, (image) => {
        return `<div class="group relative"><img${add_attribute("src", image.src, 0)}${add_attribute("alt", image.alt, 0)} class="aspect-square w-full h-full object-cover rounded-lg shadow-md cursor-pointer transition-transform duration-300 group-hover:scale-105"> <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center rounded-lg"><p class="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2">${escape(image.alt)}</p></div> </div>`;
      })}</div>`;
    }
  })}</div>`;
});
export {
  Page as default
};

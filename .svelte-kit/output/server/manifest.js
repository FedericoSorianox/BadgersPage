export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["gallery/1.jpg","gallery/2.jpg","gallery/3.jpg","gallery/4.jpg","gallery/foto1.png","logo-badgers.png","products/Lycra Marron.jpg","products/Lycra bjj.jpg","products/alfaway.jpg","products/barritas.jpg","products/bolso.jpg","products/bucal.jpg","products/cabezal rdx.png","products/cinturones.jpg","products/e135e21e-c9d2-481e-ad57-adfcf51b3479.jpg","products/images.jpg","products/keiko.jpg","products/kimono blanco.jpg","products/koral.jpg","products/lycra azul.jpg","products/lycra blanca.jpg","products/lycra violeta.jpg","products/lycra_muay_thai.jpg","products/power ade.png","products/rdx coderas.jpg"]),
	mimeTypes: {".jpg":"image/jpeg",".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.ZOoDTgQ7.js",app:"_app/immutable/entry/app.BfV2TXzH.js",imports:["_app/immutable/entry/start.ZOoDTgQ7.js","_app/immutable/chunks/B3yLMbad.js","_app/immutable/chunks/A-LiUoMI.js","_app/immutable/chunks/B2sqbLUl.js","_app/immutable/entry/app.BfV2TXzH.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/A-LiUoMI.js","_app/immutable/chunks/IHki7fMi.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/check-email",
				pattern: /^\/check-email\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/clases",
				pattern: /^\/clases\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/contacto",
				pattern: /^\/contacto\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/debug",
				pattern: /^\/debug\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/env-check",
				pattern: /^\/env-check\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/galeria",
				pattern: /^\/galeria\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/sobre-nosotros",
				pattern: /^\/sobre-nosotros\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/tienda",
				pattern: /^\/tienda\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

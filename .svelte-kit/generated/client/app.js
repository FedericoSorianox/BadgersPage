export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22')
];

export const server_loads = [0,2];

export const dictionary = {
		"/": [~3],
		"/account": [~4],
		"/admin": [~5,[2]],
		"/admin/finanzas": [~6,[2]],
		"/admin/inventario": [~7,[2]],
		"/admin/pagos": [~8,[2]],
		"/admin/products/new": [~10,[2]],
		"/admin/products/[id]": [~9,[2]],
		"/admin/socios": [~11,[2]],
		"/check-email": [12],
		"/clases": [~13],
		"/contacto": [14],
		"/debug-login": [16],
		"/debug": [15],
		"/env-check": [17],
		"/galeria": [~18],
		"/login": [19],
		"/sobre-nosotros": [20],
		"/test-login": [21],
		"/tienda": [~22]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.svelte';
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
	() => import('./nodes/19')
];

export const server_loads = [0,2];

export const dictionary = {
		"/": [3],
		"/account": [~4],
		"/admin": [~5,[2]],
		"/admin/create-user": [~6,[2]],
		"/admin/products/new": [~8,[2]],
		"/admin/products/[id]": [~7,[2]],
		"/check-email": [9],
		"/clases": [~10],
		"/contacto": [11],
		"/debug-login": [13],
		"/debug": [12],
		"/env-check": [14],
		"/galeria": [~15],
		"/login": [16],
		"/sobre-nosotros": [17],
		"/test-login": [18],
		"/tienda": [~19]
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
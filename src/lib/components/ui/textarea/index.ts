import type { HTMLTextareaAttributes } from 'svelte/elements';
import Root from './textarea.svelte';

type Props = HTMLTextareaAttributes;

type Events = {
	[evt: string]: CustomEvent<unknown>;
};

export const textareaAttrs = (props: Props) => {
	const { ...rest } = props;
	return rest;
};

export {
	Root,
	//
	Root as Textarea,
	type Props,
	type Events,
	//
	type Props as TextareaProps,
	type Events as TextareaEvents
}; 
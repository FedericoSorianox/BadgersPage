<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn, flyAndScale } from '$lib/utils/index.js';

	type $$Props = SelectPrimitive.ContentProps;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Content
	class="{cn(
		'relative z-50 min-w-[8rem] max-h-60 overflow-y-auto rounded-md border bg-white text-popover-foreground shadow-md',
		className
	)}"
	transition="{flyAndScale}"
	transitionConfig="{{ y: -4, duration: 200 }}"
	{...$$restProps}
>
	<div class="p-1">
		<slot />
	</div>
</SelectPrimitive.Content> 
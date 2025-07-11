<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils/index.js';
	import { ChevronsUpDown } from 'lucide-svelte';

	type $$Props = SelectPrimitive.TriggerProps;
	type $$Events = SelectPrimitive.TriggerEvents;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Trigger
	class="{cn(
		'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}"
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
	<SelectPrimitive.Value placeholder="Select an option" />
	<ChevronsUpDown class="h-4 w-4 opacity-50" />
</SelectPrimitive.Trigger> 
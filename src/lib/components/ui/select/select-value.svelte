<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils/index.js';

	type $$Props = SelectPrimitive.ValueProps;

	let className: $$Props['class'] = undefined;
	export let placeholder: $$Props['placeholder'] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Value
	class="{cn('text-sm', className)}"
	{placeholder}
	{...$$restProps}
/> 
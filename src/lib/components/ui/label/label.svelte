<script lang="ts">
	import { Label as LabelPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";
	import { labelVariants } from ".";

	type $$Props = LabelPrimitive.RootProps;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<LabelPrimitive.Root class={cn(labelVariants(), className)} {...$$restProps}>
	<slot />
</LabelPrimitive.Root>
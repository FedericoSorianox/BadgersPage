<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";

	type $$Props = SelectPrimitive.Props<string, false>;
	export let value: $$Props["value"] = undefined;
</script>

<SelectPrimitive.Root {...$$restProps} bind:value>
	<slot />
</SelectPrimitive.Root> 
import Root from "./label.svelte";
import { tv, type VariantProps } from "tailwind-variants";

const labelVariants = tv({
	base: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
});

type Variant = VariantProps<typeof labelVariants>["variant"];
type Size = VariantProps<typeof labelVariants>["size"];

export {
	Root,
	//
	Root as Label,
	labelVariants,
};
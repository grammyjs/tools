import { computed, Ref } from "vue";
type EnumOf<T extends string> = { [k in T as Uppercase<k>]: Lowercase<k> };

export const COLOR_VARIANTS = ["default", "primary", "danger", "success"] as const;
export type ColorVariant = (typeof COLOR_VARIANTS)[number];
export const ColorVariant = Object.fromEntries(
  COLOR_VARIANTS.map((variant) => [variant.toUpperCase(), variant]),
) as EnumOf<ColorVariant>;

export const VARIANT_COLORS = {
  danger: "red",
  default: "slate",
  primary: "grammy",
  success: "green",
} satisfies { [v in ColorVariant]: string };

export const useColorVariant = (variant: Ref<ColorVariant>) => computed(() => VARIANT_COLORS[variant.value]);

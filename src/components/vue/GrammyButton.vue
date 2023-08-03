<script setup lang="ts">
import { computed, toRefs, withDefaults } from "vue";
import { ColorVariant, useColorVariant } from "../../colors";

type Size = "small" | "regular" | "large";

const props = withDefaults(
  defineProps<{ disabled?: boolean; loading?: boolean; variant?: ColorVariant; size?: Size }>(),
  {
    variant: ColorVariant.DEFAULT,
    size: "regular",
  },
);

const { disabled, variant, size } = toRefs(props);

/** Colors */
const colorVariant = useColorVariant(variant);

/** Sizes */
const SIZE_PROPERTIES = {
  small: {
    padding: "1",
    text: "xs",
  },
  regular: {
    padding: "2",
    text: "md",
  },
  large: {
    padding: "4",
    text: "xl",
  },
} satisfies { [s in Size]: { padding: string; text: string } };

const sizeVariant = computed(() => SIZE_PROPERTIES[size.value]);

const classes = computed(() => {
  const BASE_CLASSESS = [
    "border",
    "rounded",
    "font-semibold",
    "capitalize",
    "transition-all",
    "hover:bg-opacity-20",
    "active:bg-opacity-20",
    "disabled:bg-translucentbackground",
    "disabled:text-gray-700",
    "disabled:border-gray-700",
    "disabled:cursor-not-allowed",
  ];

  const isDefault = variant.value === ColorVariant.DEFAULT;
  const light = isDefault ? 200 : 500;
  const dark = isDefault ? 500 : 700;

  const colorClasses = [
    `border-${colorVariant.value}-${light}`,
    `text-${colorVariant.value}-${light}`,
    `hover:bg-${colorVariant.value}-${light}`,
    `active:bg-${colorVariant.value}-${dark}`,
  ];

  const sizeClasses = [`p-${sizeVariant.value.padding}`, `text-${sizeVariant.value.text}`];

  return [BASE_CLASSESS, colorClasses, sizeClasses, props.loading ? "animate-blink" : ""]
    .flat()
    .filter(Boolean)
    .join(" ");
});
</script>
<template>
  <button :disabled="disabled" :class="classes">
    <slot :color="colorVariant" :size="sizeVariant"></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{ disabled?: boolean }>();
</script>
<template>
  <button
    :disabled="disabled"
    :class="
      [
        'rounded',
        'border',
        'bg-transparent',
        'p-2',
        'font-semibold',
        'capitalize',
        'transition-all',
        'hover:bg-grammy',
        'active:bg-grammy-darken-20',
        'disabled:bg-translucentbackground',
        'disabled:text-gray-700',
        'disabled:border-gray-700',
        'disabled:cursor-not-allowed',
      ].join(' ')
    "
  >
    <slot></slot>
  </button>
</template>

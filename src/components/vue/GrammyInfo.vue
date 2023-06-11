<script setup lang="ts">
defineProps<{ title?: string; value?: string | number | undefined | null }>();
</script>
<template>
  <div class="flex flex-col border-r text-center last-of-type:border-0">
    <slot name="value">
      <span class="font-bold">
        {{ value ?? "-" }}
      </span>
    </slot>
    <slot name="title">
      <span class="text-sm font-light">{{ title ?? "" }}</span>
    </slot>
  </div>
</template>

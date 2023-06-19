<script setup lang="ts">
defineProps<{ title?: string; value?: string | number | undefined | null }>();
</script>
<template>
  <div class="flex flex-col border-r text-center last-of-type:border-0">
    <slot name="value">
      <span class="font-bold">
        <slot name="value-content">{{ value ?? "-" }}</slot>
      </span>
    </slot>
    <slot name="title">
      <span class="text-sm font-light">
        <slot name="title-content">{{ title ?? "" }}</slot>
      </span>
    </slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>();
defineEmits(["update:modelValue"]);
</script>

<template>
  <input
    v-bind="$attrs"
    :value="modelValue"
    type="text"
    autocomplete="off"
    class="rounded bg-translucentbackground p-2"
    @input="$emit('update:modelValue', ($event.target as any).value)"
  />
</template>

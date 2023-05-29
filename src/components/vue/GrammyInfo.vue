<script setup lang="ts">
defineProps<{ title: string, value: string | number | undefined | null }>()
</script>
<template>
  <div class="flex flex-col text-center border-r last-of-type:border-0">
    <span>
      {{ value ?? '-' }}
    </span>
    <span>{{ title }}</span>
  </div>
</template>

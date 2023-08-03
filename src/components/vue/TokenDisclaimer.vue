<script setup lang="ts">
defineProps<{ sourceUrl: string }>();
</script>
<template>
  <div class="text-xs">
    <span class="opacity-50">Your token is </span
    ><a target="_blank" class="text-grammy-600" :href="sourceUrl">stored in your browser</a
    ><span class="opacity-50"> and used only in requests made directly to the Bot API.</span>
  </div>
</template>

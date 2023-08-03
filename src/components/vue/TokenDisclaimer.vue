<script setup lang="ts">
defineProps<{ sourceUrl: string }>();
</script>
<template>
  <div class="text-xs opacity-50">
    Your token is <a target="_blank" class="font-bold" :href="sourceUrl">stored in your browser</a> and used only in
    requests made directly to the Bot API.
  </div>
</template>

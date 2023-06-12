<script setup lang="ts">
defineProps<{ sourceUrl: string }>();
</script>
<template>
  <div class="rounded text-center text-xs text-slate-500">
    Your token is <a target="_blank" class="font-bold underline" :href="sourceUrl">stored in your browser</a> and used only in requests
    made directly to the Bot API.
  </div>
</template>

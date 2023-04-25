<script setup lang="ts">
import GrammyButton from "../GrammyButton.vue";
import { localRef } from "../composables/persistentRef";

const token = localRef("token", "");
</script>

<template>
  <div class="container mx-auto my-auto lg:px-96">
    <div class="rounded bg-altbackground p-10">
      <form>
        <label for="token">Bot Token</label>
        <input
          v-model="token"
          id="token"
          type="text"
          autocomplete="off"
          placeholder="Given to you by @botfather"
          class="mt-2 w-full bg-translucentbackground p-2"
        />
        <div class="flex flex-row justify-end">
          <grammy-button :disabled="!token" class="mt-6" type="submit" @click.prevent> load bot info </grammy-button>
        </div>
      </form>
    </div>
  </div>
</template>

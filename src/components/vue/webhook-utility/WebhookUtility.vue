<script setup lang="ts">
import { computed } from "vue";
import ErrorMessage from "../ErrorMessage.vue";
import WebhookInfo from "./WebhookInfo.vue";
import TokenDisclaimer from "../TokenDisclaimer.vue";
import { token, useApiMethod } from "./store";

const { refresh: getMe, state, data: botInfo } = useApiMethod("getMe");
const disableLoadBotInfo = computed(() => !token.value || state.value === "loading");
const clearToken = () => {
  token.value = "";
  state.value = "idle";
};
</script>

<template>
  <main class="mx-auto flex w-full max-w-screen-sm flex-col">
    <div v-show="state !== 'success'" class="flex flex-col">
      <error-message class="mb-5" v-if="state === 'error'">
        Something went wrong when calling the <span class="font-bold">getMe</span> API method. Try checking your token.
      </error-message>
      <button
        :disabled="disableLoadBotInfo"
        class="button absolute top-2 h-[44px]"
        type="submit"
        @click.prevent="getMe"
        :loading="state === 'loading'"
      >
        Load Info
      </button>
      <form>
        <input
          v-model="token"
          id="token"
          :disabled="state === 'loading'"
          placeholder="Bot token"
          :class="{ input: true, 'input-spoiler': token.length > 20 }"
        />
        <token-disclaimer
          source-url="https://github.com/grammyjs/tools/blob/main/src/components/vue/composables/persistentRef.ts"
        />
        <div class="flex flex-row justify-end"></div>
      </form>
    </div>
    <div v-if="state === 'success'">
      <webhook-info @clear-token="() => clearToken()" @reload="getMe" :bot-info="botInfo" :token="token" />
    </div>
  </main>
</template>

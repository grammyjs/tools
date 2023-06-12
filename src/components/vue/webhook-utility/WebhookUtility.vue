<script setup lang="ts">
import { computed } from "vue";
import ErrorMessage from "../ErrorMessage.vue";
import GrammyButton from "../GrammyButton.vue";
import GrammyTextInput from "../GrammyTextInput.vue";
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
  <div class="container mx-auto my-auto xl:px-52">
    <div class="rounded bg-altbackground p-10">
      <div v-show="state !== 'success'">
        <error-message class="mb-5" v-if="state === 'error'">
          Something went wrong when calling the <span class="font-bold">getMe</span> API method. Try checking your
          token.
        </error-message>
        <form>
          <label for="token">Bot Token</label>
          <grammy-text-input
            v-model="token"
            id="token"
            type="text"
            placeholder="Given to you by @botfather"
            class="mt-2 w-full"
            :disabled="state === 'loading'"
          />
          <token-disclaimer class="mt-4" />
          <div class="flex flex-row justify-end">
            <grammy-button
              :disabled="disableLoadBotInfo"
              class="mt-3"
              type="submit"
              @click.prevent="getMe"
              :loading="state === 'loading'"
              variant="primary"
            >
              load bot info
            </grammy-button>
          </div>
        </form>
      </div>
      <div v-if="state === 'success'">
        <webhook-info @clear-token="() => clearToken()" @reload="getMe" :bot-info="botInfo" :token="token" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTelegramApi } from "grammy-vue";
import type { UserFromGetMe } from "grammy/types";
import { onMounted, ref, toRefs, watch } from "vue";
import ErrorMessage from "../ErrorMessage.vue";
import ManageWebhook from "./ManageWebhook.vue";

const emit = defineEmits(["clearToken", "reload"]);
const props = defineProps<{ botInfo: UserFromGetMe | undefined; token: string }>();
const { token, botInfo } = toRefs(props);
const { useApiMethod } = useTelegramApi(token);
const { refresh: getWebhookInfo, data: webhookInfo, error: error, state: state } = useApiMethod("getWebhookInfo");

/** Webhook fields */
const url = ref(webhookInfo.value?.url ?? "");

watch(webhookInfo, (newValue) => {
  if (newValue?.url) url.value = newValue.url;
});

const reload = (reloadBotInfo: boolean = false) => {
  getWebhookInfo();
  if (reloadBotInfo) emit("reload");
};

onMounted(() => {
  getWebhookInfo();
});
</script>
<template>
  <error-message class="webhook-info-error" v-if="state === 'error'">
    {{ error?.message }}
  </error-message>
  <div class="webhook-info-loading" v-if="state === 'loading'">Loading...</div>
  <div class="webhook-info flex w-full flex-col" v-if="botInfo && webhookInfo && state === 'success'">
    <a
      :href="`https://t.me/${botInfo.username}`"
      class="absolute top-2 flex h-[44px] items-center justify-center self-end text-center text-sm opacity-50"
      target="_blank"
      rel="noopener noreferrer"
    >
      @{{ botInfo.username }}
    </a>

    <div class="webhook-fields mt-5">
      <manage-webhook @clear-token="$emit('clearToken')" @refresh="reload" :url="webhookInfo.url" :allowed-updates="webhookInfo.allowed_updates" />
    </div>
  </div>
</template>

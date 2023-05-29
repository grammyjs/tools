<script setup lang="ts">
import { useTelegramApi } from "grammy-vue";
import type { UserFromGetMe, WebhookInfo } from "grammy/types";
import { computed, onMounted, ref, toRefs, watch } from "vue";
import ErrorMessage from "../ErrorMessage.vue";
import GrammyButton from "../GrammyButton.vue";
import GrammyInfo from "../GrammyInfo.vue";
import GrammyTextInput from "../GrammyTextInput.vue";

defineEmits(['clearToken'])
const props = defineProps<{ botInfo: UserFromGetMe | undefined; token: string }>();
const { token, botInfo } = toRefs(props);
const { useApiMethod } = useTelegramApi(token);
const { refresh: getWebhookInfo, data: webhookInfo, error: error, state: state } = useApiMethod("getWebhookInfo");

const info = computed(() => ({
  ...(botInfo.value ? botInfo.value : {}),
  ...(webhookInfo.value ? webhookInfo.value : {}),
}));

/** Boolean Properties */
type BooleanKeys<T> = keyof { [k in keyof T as T[k] extends boolean ? k : never]: never };
type BooleansFromGetMe = BooleanKeys<Required<UserFromGetMe>>;
type BooleansFromWebhookInfo = BooleanKeys<Required<WebhookInfo>>;

const USERINFO_DISPLAYED_PROPERTIES: Array<BooleansFromGetMe | BooleansFromWebhookInfo> = [
  "added_to_attachment_menu",
  "can_join_groups",
  "can_read_all_group_messages",
  "supports_inline_queries",
  "has_custom_certificate",
];

const snakeToSentenceCase = (words: string) =>
  `${words.charAt(0).toUpperCase()}${words.split("").slice(1).join("")}`.replace(/_/g, " ");

/** Webhook fields */
const url = ref(webhookInfo.value?.url ?? "");
const secret = ref("");

watch(webhookInfo, (newValue) => {
  if (newValue?.url) url.value = newValue.url;
});

/** Display info */
const botName = computed(() => [botInfo.value?.first_name, botInfo.value?.last_name].filter(Boolean).join(""));
const formatDate = (value?: number) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

onMounted(() => {
  getWebhookInfo();
});
</script>
<template>
  <error-message class="webhook-info-error" v-if="state === 'error'">
    {{ error?.message }}
  </error-message>
  <div class="webhook-info-loading" v-if="state === 'loading'">Loading...</div>
  <div class="webhook-info ml-3" v-if="botInfo && webhookInfo && state === 'success'">
    <div class="flex flex-row font-bold text-xl mb-10 pb-2 border-b-2">
      <span class="">{{ botName }}</span>
      <div class="flex-auto"></div>
      <a :href="`https://t.me/${botInfo.username}`" class="underline"> @{{ botInfo.username }} </a>
    </div>
    <div class="webhook-stats my-5 grid grid-cols-3">
      <grammy-info
        :title="`pending update${(info.pending_update_count ?? 0) !== 1 ? 's' : ''}`"
        :value="info.pending_update_count"
      />
      <grammy-info title="last error date" :value="formatDate(info.last_error_date)" />
      <grammy-info title="last sync error date" :value="formatDate(info.last_synchronization_error_date)" />
    </div>
    <div class="boolean-properties my-3 grid grid-cols-2 rounded py-3">
      <div v-for="property of USERINFO_DISPLAYED_PROPERTIES">
        <input
          type="checkbox"
          :checked="info[property]"
          readonly
          @click.prevent
          value="added_to_attachment_menu ? false}"
          id="added_to_attachment_menu"
          class="checked:accent-grammy"
        />
        <label for="added_to_attachment_menu" class="ms-2">{{ snakeToSentenceCase(property) }}</label>
      </div>
    </div>
    <div class="webhook-fields flex flex-col rounded">
      <div class="mb-2 flex flex-col">
        <label for="url" class="mr-2">Webhook URL</label>
        <grammy-text-input type="text" v-model="url" id="url" />
      </div>
      <div class="flex flex-col">
        <label for="secret" class="mr-2">Webhook secret</label>
        <grammy-text-input id="secret" type="password" v-model="secret" />
      </div>
      <div class="mt-5 flex">
        <grammy-button @click="() => $emit('clearToken')">⬅️ change token</grammy-button>
        <div class="flex-auto"></div>
        <grammy-button class="me-3">❌ delete webhook</grammy-button>
        <grammy-button>✅ set webhook</grammy-button>
      </div>
    </div>
  </div>
</template>

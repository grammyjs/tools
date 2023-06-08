<script setup lang="ts">
import { useTelegramApi } from "grammy-vue";
import type { UserFromGetMe, WebhookInfo } from "grammy/types";
import { computed, onMounted, ref, toRefs, watch } from "vue";
import ErrorMessage from "../ErrorMessage.vue";
import GrammyButton from "../GrammyButton.vue";
import GrammyInfo from "../GrammyInfo.vue";
import ExternalIcon from "../icons/ExternalIcon.vue";
import LeftArrowIcon from "../icons/LeftArrowIcon.vue";
import PencilIcon from "../icons/PencilIcon.vue";
import ManageWebhook from "./ManageWebhook.vue";

defineEmits(["clearToken"]);
const props = defineProps<{ botInfo: UserFromGetMe | undefined; token: string }>();
const { token, botInfo } = toRefs(props);
const { useApiMethod } = useTelegramApi(token);
const { refresh: getWebhookInfo, data: webhookInfo, error: error, state: state } = useApiMethod("getWebhookInfo");
const currentAction = ref<"editing" | "visualizing">("visualizing");

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

const refresh = (info: WebhookInfo) => {
  currentAction.value = 'visualizing'
  webhookInfo.value = info
}

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
    <div class="flex flex-row justify-between pb-2 text-xl font-bold">
      <span>{{ botName }}</span>
      <a
        :href="`https://t.me/${botInfo.username}`"
        class="border-b border-altbackground hover:border-white"
        target="_blank"
      >
        @{{ botInfo.username }} <external-icon class="inline h-3 w-3" />
      </a>
    </div>
    <hr />
    <div class="webhook-stats my-5 grid grid-cols-3">
      <grammy-info
        :title="`pending update${(info.pending_update_count ?? 0) !== 1 ? 's' : ''}`"
        :value="info.pending_update_count"
      />
      <grammy-info title="last error date" :value="formatDate(info.last_error_date)" />
      <grammy-info title="last sync error date" :value="formatDate(info.last_synchronization_error_date)" />
    </div>
    <hr />
    <div class="boolean-properties my-3 grid grid-cols-3 gap-x-5 py-3">
      <div v-for="property of USERINFO_DISPLAYED_PROPERTIES">
        <input
          type="checkbox"
          :checked="info[property]"
          readonly
          @click.prevent
          value="added_to_attachment_menu ? false}"
          id="added_to_attachment_menu"
          class="checked:accent-grammy-600"
        />
        <label for="added_to_attachment_menu" class="ms-2">{{ snakeToSentenceCase(property) }}</label>
      </div>
    </div>
    <hr />
    <div class="webhook-fields mt-5">
      <div class="rounded border p-5">
        <div class="flex flex-col items-center" v-show="currentAction === 'visualizing'">
          <grammy-info title="webhook url" :value="webhookInfo.url || 'no webhook set'" />
          <grammy-button variant="primary" size="small" class="mt-4" @click="currentAction = 'editing'">
            <pencil-icon class="inline h-4 w-4 align-text-top" /> edit
          </grammy-button>
        </div>
        <manage-webhook
          @cancel="currentAction = 'visualizing'"
          @refresh="refresh"
          :url="webhookInfo.url"
          v-if="currentAction === 'editing'"
        />
      </div>
      <div class="mt-5">
        <grammy-button size="small" @click="() => $emit('clearToken')">
          <left-arrow-icon class="inline h-4 w-4" /> change token
        </grammy-button>
      </div>
    </div>
  </div>
</template>

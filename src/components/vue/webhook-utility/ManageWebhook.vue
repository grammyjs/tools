<script setup lang="ts">
import { computed, ref } from "vue";
import GrammyButton from "../GrammyButton.vue";
import GrammySwitch from "../GrammySwitch.vue";
import GrammyTextInput from "../GrammyTextInput.vue";
import CancelIcon from "../icons/CancelIcon.vue";
import CheckIcon from "../icons/CheckIcon.vue";
import TrashIcon from "../icons/TrashIcon.vue";
import AllowedUpdates from "./AllowedUpdates.vue";
import { useApiMethod } from "./store";
import { type UpdateTypes, DEFAULT_UPDATE_TYPES } from "./update-types";

const emit = defineEmits<{
  (event: "cancel"): void;
  (event: "refresh"): void;
}>();

const props = withDefaults(defineProps<{ url: string; allowedUpdates: readonly UpdateTypes[] }>(), {
  url: "",
  allowedUpdates: () => DEFAULT_UPDATE_TYPES,
});
const newUrl = ref(props.url);
const secret = ref("");
const newAllowedUpdates = ref(props.allowedUpdates);
const dropPendingUpdates = ref(false);

const isValidUrl = computed(() => {
  try {
    const url = new URL(newUrl.value);
    console.log((({ protocol, host }: URL) => ({ protocol, host }))(url));
    return (
      url.protocol === "https:" &&
      url.host !== "localhost" &&
      url.host !== "127.0.0.1" &&
      ["443", "80", "88", "8443", ""].includes(url.port)
    );
  } catch {
    return false;
  }
});
const canSet = computed(() => Boolean(newUrl.value) && isValidUrl.value);

const { refresh: setWebhookRaw, error: setWebhookError, state: setWebhookState } = useApiMethod("setWebhook");
const {
  refresh: deleteWebhookRaw,
  error: deleteWebhookError,
  state: deleteWebhookState,
} = useApiMethod("deleteWebhook");

const withRefresh = (fn: () => Promise<any>) => () => fn().then(() => emit("refresh"));

const setWebhook = withRefresh(() => {
  return setWebhookRaw(newUrl.value, {
    drop_pending_updates: dropPendingUpdates.value,
    secret_token: secret.value,
  });
});

const deleteWebhook = withRefresh(deleteWebhookRaw);
</script>
<template>
  <div class="w2-full mb-2 rounded bg-red-500 p-2" v-if="setWebhookState === 'error' || deleteWebhookState === 'error'">
    {{ setWebhookError || deleteWebhookError }}
  </div>
  <div class="mb-5 flex flex-col">
    <label for="url" class="mr-2">Webhook URL</label>
    <grammy-text-input class="mt-2" v-model="newUrl" type="text" id="url" />
  </div>
  <div class="mb-5 flex flex-col">
    <label for="secret" class="mr-2">Webhook secret</label>
    <grammy-text-input class="mt-2" id="secret" type="password" v-model="secret" />
  </div>
  <div class="flex flex-col">
    <label for="allowedUpdates" class="mr-2">Allowed Updates</label>
    <allowed-updates class="mt-2" id="allowedUpdates" v-model="newAllowedUpdates" />
  </div>
  <div class="flex flex-row justify-around">
    <grammy-switch v-model="dropPendingUpdates" class="mt-5" id="drop_pending_updates">
      Drop pending updates
    </grammy-switch>
  </div>
  <div class="mt-5 flex flex-row justify-between">
    <grammy-button @click="() => $emit('cancel')">
      <cancel-icon class="inline h-5 w-5 align-text-bottom" /> cancel
    </grammy-button>
    <div>
      <grammy-button variant="danger" class="mr-2" :loading="deleteWebhookState === 'loading'" @click="deleteWebhook">
        <trash-icon class="inline h-5 w-5 align-text-bottom" /> delete webhook
      </grammy-button>
      <grammy-button variant="success" :disabled="!canSet" :loading="setWebhookState === 'loading'" @click="setWebhook">
        <check-icon class="inline h-5 w-5 align-text-bottom" />
        set webhook
      </grammy-button>
    </div>
  </div>
</template>

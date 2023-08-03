<script setup lang="ts">
import { computed, ref } from "vue";
import AllowedUpdates from "./AllowedUpdates.vue";
import { useApiMethod } from "./store";
import { type UpdateTypes, DEFAULT_UPDATE_TYPES } from "./update-types";

const emit = defineEmits<{
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
    allowed_updates: newAllowedUpdates.value,
  });
});

const deleteWebhook = withRefresh(deleteWebhookRaw);
</script>
<template>
  <div class="w2-full mb-2 rounded bg-red-500 p-2" v-if="setWebhookState === 'error' || deleteWebhookState === 'error'">
    {{ setWebhookError || deleteWebhookError }}
  </div>
  <div class="mb-5 flex flex-col">
    <input class="input" v-model="newUrl" type="text" placeholder="Webhook URL" id="url" />
  </div>
  <div class="mb-1 flex flex-col">
    <input class="input mt-1.5" id="secret" type="password" placeholder="Webhook secret (optional)" v-model="secret" />
  </div>
  <label class="pl-2">
    <input type="checkbox" :checked="dropPendingUpdates" class="mt-5" />
    Drop pending updates
  </label>
  <div class="mt-4 flex flex-col">
    <label for="allowedUpdates" class="font-bold">Allowed Updates</label>
    <allowed-updates id="allowedUpdates" v-model="newAllowedUpdates" />
  </div>
  <div class="mt-5 flex w-full justify-between">
    <button class="button py-2 pr-2" @click="() => $emit('clearToken')">Change Token</button>
    <div>
      <button class="button px-2 py-2 text-red-500" :loading="deleteWebhookState === 'loading'" @click="deleteWebhook">
        Delete Webhook
      </button>
      <button class="button py-2 pl-2" :disabled="!canSet" :loading="setWebhookState === 'loading'" @click="setWebhook">
        Save Changes
      </button>
    </div>
  </div>
</template>

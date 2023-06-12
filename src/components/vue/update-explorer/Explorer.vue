<script setup lang="ts">
import type { Update } from "grammy/types";
import { Bot } from "grammy/web";
import { computed, onMounted, ref, shallowRef, watch } from "vue";
import StartIcon from "../icons/StartIcon.vue";
import StopIcon from "../icons/StopIcon.vue";
import TrashIcon from "../icons/TrashIcon.vue";
import Empty from "./Empty.vue";
import TokenDisclaimer from "../TokenDisclaimer.vue";
import { isBusy, state, stateIs } from "./state";

type DecoratedUpdate = Update & {
  type: string;
  timestamp: Date;
  hasDownload: boolean;
  url?: string;
  fileName?: string;
};

// State variables
const error = ref<Error>();
const bot = ref<Bot>();
const clearError = () => {
  error.value = undefined;
  state.value = "idle";
};

// Updates
const updatesMap = new Map<number, DecoratedUpdate>();
const updatesList = ref<Array<DecoratedUpdate>>([]);
const selectedUpdateId = ref<number>(0);
const selectedUpdate = computed(() => (selectedUpdateId.value ? updatesMap.get(selectedUpdateId.value) : undefined));
const undecoratedSelectedUpdate = computed(() =>
  selectedUpdate.value
    ? (({ type, timestamp, hasDownload, url, ...update }: DecoratedUpdate) => update)(selectedUpdate.value)
    : undefined
);
const clearUpdates = () => {
  updatesList.value = [];
  updatesMap.clear();
  selectedUpdateId.value = 0;
};

// Listening
const token = ref("");
watch(token, (value) => {
  localStorage.setItem("token", JSON.stringify(value));
});
const hasToken = computed(() => Boolean(token.value));
onMounted(() => {
  token.value = JSON.parse(localStorage.getItem("token") ?? "");
});

const toggleListening = () => {
  if (stateIs("listening")) return stopListening();
  return startListening();
};

const startListening = async () => {
  if (stateIs("initializing")) return;
  state.value = "initializing";
  try {
    bot.value = new Bot(token.value);

    bot.value.use(async (ctx) => {
      const hasDownload = ctx.has(":file");
      const url = hasDownload
        ? await ctx.getFile().then((file) => ({
            url: `https://api.telegram.org/file/bot${token.value}/${file.file_path}`,
          }))
        : {};

      const decoratedUpdate = {
        ...ctx.update,
        type: Object.keys(ctx.update).filter((key) => key !== "update_id")[0] ?? "unknown",
        timestamp: new Date(),
        hasDownload,
        ...url,
      };

      updatesMap.set(ctx.update.update_id, decoratedUpdate);
      updatesList.value.unshift(decoratedUpdate);
      if (!selectedUpdateId.value) selectedUpdateId.value = ctx.update.update_id;
    });

    await bot.value.api.getMe();
    await bot.value.init();
    await bot.value.start({
      allowed_updates: [
        "message",
        "edited_message",
        "channel_post",
        "edited_channel_post",
        "inline_query",
        "chosen_inline_result",
        "callback_query",
        "shipping_query",
        "pre_checkout_query",
        "poll",
        "poll_answer",
        "my_chat_member",
        "chat_member",
        "chat_join_request",
      ],
      onStart: () => {
        state.value = "listening";
      },
    });
  } catch (err) {
    state.value = "error";
    error.value = err as Error;
  }
};

const stopListening = async () => {
  if (stateIs("stopping")) return;
  state.value = "stopping";
  await bot.value?.stop();
  state.value = "stopped";
};

// Display
const stateLabel = computed(() => {
  switch (state.value) {
    case "error":
      return "Error";
    case "initializing":
      return "Initializing";
    case "listening":
      return `Listening as @${bot.value?.botInfo.username}`;
    case "stopping":
      return "Stopping";
    default:
      return "Idle";
  }
});

const formatDate = (date: Date) =>
  date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const Editor = shallowRef<typeof Empty | typeof import("json-editor-vue")["default"]>(Empty);
onMounted(async () => {
  const component = await import("json-editor-vue");
  Editor.value = component.default;
});
</script>
<template>
  <main class="flex flex-1 flex-col bg-translucentbackground">
    <div
      v-if="error"
      class="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50"
    >
      <div class="w-96 rounded-md border-l-8 border-l-red-500 bg-altbackground p-5 shadow-lg">
        <span class="text-lg font-bold">An error has occured</span>
        <p class="text-sm">There was an unexpected error. Check the details below:</p>
        <pre class="mt-3 bg-background">{{ JSON.stringify(error, null, 2) }}</pre>
        <div class="flex w-full flex-row-reverse items-end">
          <button
            class="relative right-1 mt-4 rounded-md border bg-opacity-50 px-2 py-1 align-middle"
            @click="clearError()"
          >
            Close
          </button>
        </div>
      </div>
    </div>
    <section class="mx-auto w-full max-w-screen-sm">
      <div class="relative w-full max-w-screen-sm">
        <button
          type="button"
          :disabled="isBusy || !hasToken"
          class="absolute bottom-10 right-9 flex cursor-pointer items-center disabled:cursor-wait disabled:opacity-30"
          @click="toggleListening()"
          :class="{ 'animate-blink': stateIs('listening') }"
        >
          <StartIcon class="absolute h-7 w-7 stroke-green-500" v-if="stateIs('idle', 'stopped', 'error')" />
          <StopIcon class="absolute h-7 w-7 stroke-red-500" v-if="stateIs('initializing', 'listening', 'stopping')" />
        </button>
        <input
          :disabled="!stateIs('idle', 'stopped')"
          id="token"
          v-model="token"
          type="text"
          placeholder="Token obtained from talking to @botfather"
          class="mb-4 w-full overflow-auto bg-altbackground p-3 placeholder:opacity-80 focus:outline-none disabled:text-gray-500 dark:placeholder:opacity-50"
        />
      </div>
      <token-disclaimer class="mb-4" />
    </section>
    <section class="flex flex-1 border-t">
      <div class="w-52">
        <div class="flex flex-row items-center justify-between border-b py-1 pl-2">
          <span>{{ stateLabel }}</span>
          <button class="h-fit" @click="clearUpdates" v-if="updatesList.length" title="Clear updates">
            <TrashIcon stroke="white" class="relative mr-2 h-5 w-5" />
          </button>
        </div>
        <div
          v-for="update in updatesList"
          :key="update.update_id"
          class="m-0 flex w-full flex-col border-b p-3 text-sm text-white"
          :class="{ ['bg-gray-800']: selectedUpdateId === update.update_id }"
          @click="selectedUpdateId = update.update_id"
        >
          <span>{{ update.type }}</span>
          <span>{{ update.update_id }} - {{ formatDate(update.timestamp) }}</span>
          <span class="cursor-pointer underline" v-if="update.hasDownload">
            <a :href="update.url" download>Download media</a>
          </span>
        </div>
      </div>
      <div class="w-full flex-1 overflow-auto bg-altbackground p-0" style="max-height: 86.5vh">
        <component
          :is="Editor"
          :mode="'text'"
          read-only
          class="jse-theme-dark h-full"
          :navigation-bar="false"
          :main-menu-bar="false"
          :status-bar="false"
          :model-value="selectedUpdate ? undecoratedSelectedUpdate : undefined"
        />
      </div>
    </section>
  </main>
</template>
<style scoped>
@import "https://cdn.jsdelivr.net/npm/vanilla-jsoneditor/themes/jse-theme-dark.css";
</style>

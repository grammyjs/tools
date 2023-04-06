<script setup lang="ts">
import type { Update } from "grammy/types";
import { Bot } from "grammy/web";
import { computed, onMounted, ref, shallowRef, watch } from "vue";
import StartIcon from "../icons/StartIcon.vue";
import StopIcon from "../icons/StopIcon.vue";
import Empty from "./Empty.vue";
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

// Listening
const token = ref(localStorage.getItem("token") || "");
watch(token, (value) => {
  localStorage.setItem("token", value);
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
      return "Listening";
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
    <section class="mx-auto w-full max-w-screen-sm">
      <div class="relative w-full max-w-screen-sm">
        <div
          class="absolute bottom-10 right-9 flex cursor-pointer items-center"
          @click="toggleListening()"
          :class="{ 'cursor-wait': isBusy, 'opacity-30': isBusy, 'animate-blink': stateIs('listening') }"
        >
          <StartIcon stroke="green" class="absolute h-7 w-7 text-slate-400" v-if="stateIs('idle', 'stopped')" />
          <StopIcon stroke="red" class="absolute h-7 w-7 text-slate-400" v-else />
        </div>
        <input
          :disabled="!stateIs('idle', 'stopped')"
          id="token"
          v-model="token"
          type="text"
          placeholder="Token obtained from talking to @botfather"
          class="mb-4 w-full overflow-auto bg-altbackground p-3 placeholder:opacity-80 focus:outline-none disabled:text-gray-500 dark:placeholder:opacity-50"
        />
      </div>
    </section>
    <section class="flex flex-1 border-t">
      <div class="w-52">
        <div class="border-b py-1 pl-2">Status: {{ stateLabel }}</div>
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

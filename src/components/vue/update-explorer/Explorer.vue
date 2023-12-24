<script setup lang="ts">
import type { Update } from "grammy/types";
import { Bot } from "grammy/web";
import { computed, onMounted, ref, shallowRef, watch } from "vue";
import StartIcon from "../icons/StartIcon.vue";
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
    : undefined,
);
const clearUpdates = () => {
  updatesList.value = [];
  updatesMap.clear();
  selectedUpdateId.value = 0;
};

// Listening
const token = ref("");
const username = ref("");

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

    const me = await bot.value.api.getMe();
    username.value = me.username;
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
      return "Starting...";
    case "listening":
      return "Listening to updates...";
    case "stopping":
      return "Stopping...";
    default:
      return "Idle";
  }
});

const formatDate = (date: Date) =>
  date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

const Editor = shallowRef<typeof Empty | (typeof import("json-editor-vue"))["default"]>(Empty);
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
      <div class="max-w-min rounded-md border-l-8 border-l-red-500 bg-altbackground p-5 shadow-lg">
        <span class="text-lg font-bold">An error has occured</span>
        <p class="text-sm">There was an unexpected error. Check the details below:</p>
        <pre class="mt-3 break-all bg-background" v-if="error.stack?.includes('getMe')">
Invalid Bot token has been provided or a network problem has occured
</pre
        >
        <pre class="mt-3 bg-background" v-else>{{ JSON.stringify(error, null, 2) }}</pre>
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
    <div class="px-4">
      <section class="mx-auto flex w-full max-w-screen-sm flex-col justify-center">
        <a
          v-if="!stateIs('idle', 'stopped') && username != ''"
          :href="`https://t.me/${username}`"
          class="absolute top-2 flex h-[44px] items-center justify-center self-end text-center text-sm opacity-50 duration-75 hover:text-grammy-600 hover:opacity-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          @{{ username }}
        </a>
        <div class="relative w-full max-w-screen-sm">
          <button
            type="button"
            :disabled="isBusy || !hasToken"
            class="absolute bottom-0 right-3 top-0 z-[100] my-auto flex cursor-pointer items-center disabled:cursor-not-allowed disabled:opacity-30"
            @click="toggleListening()"
          >
            <StartIcon class="h-6 w-6" v-if="stateIs('idle', 'stopped', 'error')" />
          </button>
          <div v-if="!stateIs('idle', 'stopped')" class="flex items-center justify-between pt-3">
            <div>{{ stateLabel }}</div>
            <div
              @click="toggleListening()"
              v-if="stateIs('listening')"
              class="blink h-3 w-3 cursor-pointer rounded-full bg-black dark:bg-white"
            ></div>
          </div>
          <input
            v-if="stateIs('idle', 'stopped')"
            id="token"
            v-model="token"
            type="password"
            placeholder="Bot token"
            class="input"
          />
        </div>
        <token-disclaimer
          v-if="stateIs('idle', 'stopped')"
          source-url="https://github.com/grammyjs/tools/blob/main/src/components/vue/update-explorer/Explorer.vue#L44"
        />
      </section>
    </div>
    <section :class="{ 'mt-5': !stateIs('idle', 'stopped'), flex: true, 'flex-1': true }" v-if="!stateIs('idle')">
      <div class="w-full flex-1 overflow-auto bg-altbackground p-0" style="max-height: 86.5vh">
        <component
          :is="Editor"
          :mode="'text'"
          read-only
          class="jse h-full"
          :navigation-bar="false"
          :main-menu-bar="false"
          :status-bar="false"
          :model-value="selectedUpdate ? undecoratedSelectedUpdate : undefined"
        />
      </div>
      <div class="jse w-52" style="border-top: var(--jse-main-border); background-color: var(--jse-background-color)">
        <div
          class="flex flex-row items-center justify-between border-b border-[rgba(0,0,0,.1)] py-1 pl-2 dark:border-[rgba(255,255,255,.1)]"
          v-if="updatesList.length"
        >
          <span></span>
          <button class="h-fit" @click="clearUpdates" title="Clear updates">
            <TrashIcon stroke="currentColor" class="relative mr-2 h-5 w-5" />
          </button>
        </div>
        <div
          v-for="[i, update] in updatesList.entries()"
          :key="update.update_id"
          class="m-0 flex flex w-full cursor-pointer flex-col flex-col gap-3 border-[rgba(0,0,0,.1)] p-3 text-sm text-black duration-75 dark:border-[rgba(255,255,255,.1)] dark:text-white [&:not(:last-child)]:border-b"
          :class="{
            ['bg-altbackground']: selectedUpdateId === update.update_id,
            'hover:opacity-50': selectedUpdateId !== update.update_id,
          }"
          @click="selectedUpdateId = update.update_id"
        >
          <div class="flex justify-between gap-2 text-xs opacity-50">
            <span class="select-none">#{{ i + 1 }}</span
            ><span>{{ formatDate(update.timestamp) }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span><span class="select-none">Type: </span>{{ update.type }}</span>
            <span><span class="select-none">ID: </span>{{ update.update_id }}</span>
          </div>
          <span class="cursor-pointer underline" v-if="update.hasDownload">
            <a :href="update.url" download>Download Media</a>
          </span>
        </div>
      </div>
    </section>
  </main>
</template>

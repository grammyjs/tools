<script setup lang="ts">
import { onMounted, ref, shallowRef } from "vue";
import StartIcon from "../icons/StartIcon.vue";
import StopIcon from "../icons/StopIcon.vue";
import Empty from "./Empty.vue";

type States = "idle" | "starting" | "listening" | "stopping" | "stopped";

const token = ref("");
const state = ref<States>("idle");

const toggleState = () => {
  state.value = state.value === "idle" ? "listening" : "idle";
};

const stateIs = (...states: States[]) => states.includes(state.value);

const value = ref();

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
        <div class="absolute bottom-10 right-9 flex cursor-pointer items-center" @click="toggleState">
          <StartIcon stroke="green" class="absolute h-7 w-7 text-slate-400" v-if="stateIs('idle', 'stopped')" />
          <StopIcon stroke="red" class="absolute h-7 w-7 text-slate-400" v-else />
        </div>
        <input
          id="token"
          v-model="token"
          type="text"
          placeholder="Token obtained from talking to @botfather"
          class="mb-4 w-full bg-altbackground p-3 placeholder:opacity-80 focus:outline-none dark:placeholder:opacity-50"
        />
      </div>
    </section>
    <section class="grid flex-1 grid-cols-12 border-t">
      <div>
        <div class="m-0 flex w-full flex-col border-b bg-gray-800 p-3 text-sm text-white">
          <span>Message</span>
          <span>13124324 - 16:20:35</span>
        </div>
        <div class="m-0 flex w-full flex-col border-b p-3 text-sm text-white">
          <span>Message</span>
          <span>13124324 - 16:20:35</span>
        </div>
        <div class="m-0 flex w-full flex-col border-b p-3 text-sm text-white">
          <span>Message</span>
          <span>13124324 - 16:20:35</span>
        </div>
        <div class="m-0 flex w-full flex-col border-b p-3 text-sm text-white">
          <span>Message</span>
          <span>13124324 - 16:20:35</span>
        </div>
      </div>
      <div class="col-span-11 m-0 h-full w-full bg-altbackground p-0">
        <component
          :is="Editor"
          :mode="'text'"
          read-only
          class="jse-theme-dark h-full"
          :navigation-bar="false"
          :main-menu-bar="false"
          :status-bar="false"
          v-model="value"
        />
      </div>
    </section>
  </main>
</template>
<style scoped>
@import "https://cdn.jsdelivr.net/npm/vanilla-jsoneditor/themes/jse-theme-dark.css";
</style>

<!--<script setup lang="ts">
import type { Update } from "grammy/types";
import { Bot } from "grammy/web";
import MonacoEditor from "monaco-editor-vue3";
import { computed, ref, watch } from "vue";

type DecoratedUpdate = Update & {
  type: string;
  timestamp: Date;
  hasDownload: boolean;
  url?: string;
  fileName?: string;
};

const token = ref(localStorage.getItem("token") || "");
const state = ref<"idle" | "initializing" | "listening" | "stopping" | "stopped" | "error">("idle");
const error = ref<Error>();
const bot = ref<Bot>();

const updatesMap = new Map<number, DecoratedUpdate>();
const updatesList = ref<Array<DecoratedUpdate>>([]);
const selectedUpdateId = ref<number[]>([0]);
const selectedUpdate = computed(() =>
  selectedUpdateId.value[0] ? updatesMap.get(selectedUpdateId.value[0]) : undefined
);
const undecoratedSelectedUpdate = computed(() =>
  selectedUpdate.value
    ? (({ type, timestamp, hasDownload, url, ...update }: DecoratedUpdate) => update)(selectedUpdate.value)
    : undefined
);

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
        type: Object.keys(ctx.update).filter((key) => key !== "update_id")[0],
        timestamp: new Date(),
        hasDownload,
        ...url,
      };

      updatesMap.set(ctx.update.update_id, decoratedUpdate);
      updatesList.value.unshift(decoratedUpdate);
      if (!selectedUpdateId.value[0]) selectedUpdateId.value = [ctx.update.update_id];
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

const stateIs = (...states: Array<(typeof state)["value"]>) => states.includes(state.value);
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
      return "Telegram Update Viewer";
  }
});

const formatDate = (date: Date) =>
  date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
</script>

<template>
  <v-layout class="h-100" full-height>
    <v-app-bar dense color="primary" elevation="0">
      <template #prepend>
        <v-btn icon="mdi-arrow-left" href="/"></v-btn>
      </template>
      <v-toolbar-title>
        {{ stateLabel }}{{ stateIs("listening") ? ` (@${bot?.botInfo.username})` : "" }}
      </v-toolbar-title>
      <v-text-field
        variant="solo"
        placeholder="The one @botfather sent you"
        hide-details
        :readonly="stateIs('initializing', 'listening')"
        :loading="stateIs('listening')"
        v-model="token"
        label="Token"
      >
        <template #append-inner>
          <v-btn
            block
            :loading="stateIs('initializing', 'stopping')"
            :color="stateIs('listening', 'stopping') ? 'red' : 'green'"
            @click="toggleListening"
          >
            {{ stateIs("initializing", "listening") ? "stop" : "Start" }}
          </v-btn>
        </template>
      </v-text-field>

      <v-spacer></v-spacer>

      <template #append>
        <v-btn href="https://github.com/roziscoding/telegram-updates-viewer" icon="mdi-github"></v-btn>
      </template>
    </v-app-bar>

    <v-main style="height: calc(100vh - 6.9vh)">
      <v-navigation-drawer permanent :model-value="true" temporary>
        <v-list
          mandatory
          v-model:selected="selectedUpdateId"
          :return-object="false"
          class="py-0"
          style="max-height: calc(100vh - 7%)"
        >
          <v-divider />
          <v-list-item v-for="update in updatesList" :value="update.update_id">
            <template #append v-if="update.hasDownload">
              <v-icon color="secondary" icon="mdi-download" size="x-small"></v-icon>
            </template>
            <v-list-item-title>
              {{ update.type }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ update.update_id }} {{ formatDate(update.timestamp) }} </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <a v-if="selectedUpdate && selectedUpdate.hasDownload && selectedUpdate.url" download :href="selectedUpdate.url">
        <v-btn
          color="secondary"
          class="ma-6"
          icon="mdi-download"
          position="fixed"
          location="bottom right"
          style="z-index: 1"
        ></v-btn>
      </a>
      <v-row v-if="stateIs('error')">
        <v-expand-x-transition>
          <v-col cols="12">
            <v-alert title="Error" variant="tonal" color="error">
              {{ error?.message || error }}
            </v-alert>
          </v-col>
        </v-expand-x-transition>
      </v-row>
      <monaco-editor
        class="h-100"
        :options="{
          readOnly: true,
          wordWrap: 'on',
          scrollbar: {
            alwaysConsumeMouseWheel: true,
          },
          scrollBeyondLastLine: false,
        }"
        language="json"
        :value="selectedUpdate ? JSON.stringify(undecoratedSelectedUpdate, null, 4) : ''"
        theme="vs-dark"
      />
    </v-main>
  </v-layout>
</template>

<style>
.v-field__append-inner {
  align-items: center !important;
  padding-top: 0 !important;
}

.grow-height {
  height: 90%;
}
</style>
-->

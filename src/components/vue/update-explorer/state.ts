import { computed, ref } from "vue";

export type State =
  | "idle"
  | "initializing"
  | "listening"
  | "stopping"
  | "stopped"
  | "error";
export const state = ref<State>("idle");
export const stateIs = (...states: Array<State>) =>
  states.includes(state.value);
export const isBusy = computed(() => stateIs("initializing", "stopping"));

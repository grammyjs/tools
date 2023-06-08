import { useTelegramApi } from "grammy-vue";
import { persistentRef } from "../composables/persistentRef";

export const token = persistentRef("token", "");
export const { useApiMethod } = useTelegramApi(token);

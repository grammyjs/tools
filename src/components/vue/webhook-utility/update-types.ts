// TODO: Import from core once https://github.com/grammyjs/grammY/pull/422 is merged
export const DEFAULT_UPDATE_TYPES = [
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
  "chat_join_request",
] as const;

export const ALL_UPDATE_TYPES = [...DEFAULT_UPDATE_TYPES, "chat_member"] as const;

export type UpdateTypes = (typeof ALL_UPDATE_TYPES)[number];

import { API_CONSTANTS } from "grammy/web";

type AllUpdateTypes = (typeof API_CONSTANTS)["ALL_UPDATE_TYPES"];
type DefaultUpdateTypes = Array<Omit<AllUpdateTypes[number], "chat_member">>;

export const ALL_UPDATE_TYPES = API_CONSTANTS.ALL_UPDATE_TYPES;
export const DEFAULT_UPDATE_TYPES: DefaultUpdateTypes = ALL_UPDATE_TYPES.filter((t) => t !== "chat_member");

export type UpdateTypes = (typeof ALL_UPDATE_TYPES)[number];

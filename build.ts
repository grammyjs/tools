import { createBuilder } from "ultra/build.ts";
import { build } from "./unocss.ts";

const builder = createBuilder({
  browserEntrypoint: import.meta.resolve("./client.tsx"),
  serverEntrypoint: import.meta.resolve("./server.tsx"),
});

builder.ignore([
  "./README.md",
  "./importMap.json",
  "./.git/**",
  "./.vscode/**",
  "./.github/**",
  "./.gitignore",
]);

await build();

// deno-lint-ignore no-unused-vars
const result = await builder.build();

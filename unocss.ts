import { expandGlob } from "std/fs/expand_glob.ts";
import { type Preset, UnoGenerator } from "unocss-core";
import presetWind from "unocss-preset-wind";

export async function build() {
  const generator = new UnoGenerator({
    presets: [presetWind() as unknown as Preset],
  });
  const styles = new Array<string>();

  for await (const { path, isFile } of expandGlob("src/**/*")) {
    if (isFile) {
      const { css } = await generator.generate(await Deno.readTextFile(path));
      styles.push(css);
    }
  }

  await Deno.writeTextFile("./public/main.css", styles.join(""));
}

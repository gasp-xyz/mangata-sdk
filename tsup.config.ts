import type { Options } from "tsup";

const config: Options = {
  entry: ["src/index.ts"],
  splitting: false,
  // minify: true,
  dts: true,
  format: ["esm"],
  clean: true
};

export default config;

import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "build/index.js",
    output: [
      {
        file: "index.js",
        format: "cjs",
        plugins: [terser()]
      },
      {
        file: "index.mjs",
        format: "es",
        plugins: [terser()]
      }
    ]
  },
  {
    input: "build/index.d.ts",
    output: {
      file: "index.d.ts",
      format: "es"
    },
    plugins: [dts()]
  }
];

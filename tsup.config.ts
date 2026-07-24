import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "components/index.ts" },
  format: ["esm", "cjs"],
  target: "es2022",
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  outDir: "dist",
  banner: { js: '"use client";' },
  external: ["react", "react-dom", "next", "next/link", "next/navigation", "framer-motion"],
});

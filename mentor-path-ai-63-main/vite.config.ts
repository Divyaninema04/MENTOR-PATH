import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    spa: {
      enabled: true,
    },
  },

  nitro: {
    preset: "node-server",

    output: {
      dir: "dist",
      serverDir: "dist/server",
      publicDir: "dist/public",
    },
  },
});
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    spa: {
      enabled: false,
    },
    prerender: {
      enabled: false,
    },
  },

  nitro: {
    preset: "node-server",
  },
});

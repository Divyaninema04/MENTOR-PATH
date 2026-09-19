import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Keep the server entry so TanStack can generate
    // the server entry expected during prerendering.
    server: {
      entry: "server",
    },

    spa: {
      enabled: true,
    },
  },

  nitro: {
    preset: "node-server",

    output: {
      dir: ".output",
      serverDir: ".output/server",
      publicDir: ".output/public",
    },
  },
});

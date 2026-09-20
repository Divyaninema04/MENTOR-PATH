import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
<<<<<<< HEAD
    spa: {
      enabled: true,
    },
=======
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
>>>>>>> 0c597a4d7a382b0328d3abefa3d56a0b61d39ce2
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
import { globSync } from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        "main": "index.html",
        ...Object.fromEntries(
        globSync("decks/**/*.html").map((file) => [
          path.relative(
            "decks",
            file.slice(0, file.length - path.extname(file).length)
          ),
          fileURLToPath(new URL(file, import.meta.url)),
        ])
      )},
    },
  },
});

import { globSync } from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

function SlidesHmr() {
  return {
    name: "slides-hmr",
    enforce: "post",
    // HMR
    handleHotUpdate({ file, server }) {
      if (file.endsWith(".md")) {
        server.config.logger.info(`Reloading ${file}`);

        server.ws.send({
          type: "full-reload",
          path: "*",
        });
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [SlidesHmr()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        ...Object.fromEntries(
          globSync("decks/**/*.html").map((file) => [
            path.relative(
              "decks",
              file.slice(0, file.length - path.extname(file).length)
            ),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
        ),
      },
    },
  },
});

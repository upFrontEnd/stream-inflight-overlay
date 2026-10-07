import { defineConfig } from "vite";

const BUILD_TIME = Date.now();

function buildTimePlugin() {
  return {
    name: "build-time",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "build-time.json",
        source: JSON.stringify({ t: BUILD_TIME }),
      });
    },
  };
}

export default defineConfig({
  define: {
    __BUILD_TIME__: BUILD_TIME,
  },
  plugins: [buildTimePlugin()],
});

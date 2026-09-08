import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
      // `server-only` is a Next.js build-time guard; it has no runtime for
      // Node/jsdom and isn't resolvable by Vite. Alias it to an empty stub
      // so server-only modules can be imported into unit tests freely.
      "server-only": path.resolve(__dirname, "tests/unit/stubs/server-only.ts"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/unit/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    css: false,
  },
});

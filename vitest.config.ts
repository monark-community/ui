import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    css: false,
    coverage: {
      provider: "v8",
      include: ["components/ui/**/*.tsx"],
      exclude: ["**/*.test.*", "tests/**"],
    },
  },
  resolve: {
    alias: {
      "@/components/ui": path.resolve(__dirname, "./components/ui"),
      "@/components/previews": path.resolve(__dirname, "./components/previews"),
      "@/lib": path.resolve(__dirname, "./lib"),
      "@": path.resolve(__dirname, "."),
    },
  },
})

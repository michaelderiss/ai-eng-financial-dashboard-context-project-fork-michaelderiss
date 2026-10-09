import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://backend:8000",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable verbose minification for smaller bundles (using built-in esbuild)
    minify: "esbuild",
    // Split larger dependencies into separate chunks for better caching
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("react") || id.includes("react-dom")) return "vendor-react";
          if (id.includes("recharts")) return "vendor-charts";
          if (id.includes("lucide-react")) return "vendor-icons";
        },
      },
    },
    // Generate source maps for production debugging
    sourcemap: true,
  },
});

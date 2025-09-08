import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/js/app.tsx"],
      refresh: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "resources/js"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  server: {
    host: "127.0.0.1", // ensure same host for CORS-free dev
    strictPort: true,   // fail if port is taken
    cors: true,         // allow cross-origin requests if needed
  },
});

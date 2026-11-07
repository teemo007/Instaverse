import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    // Hidden maps were still uploaded and publicly served, exposing the full
    // source, and made Rollup print an error per antd "use client" directive.
    sourcemap: false,
  },
});

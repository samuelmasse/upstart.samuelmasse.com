import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
    proxy: {
      "/api": {
        target: `http://localhost:3000`,
        changeOrigin: true,
        secure: true,
      },
    },
    watch: {
      ignored: ["!**/common/dist/**"],
    },
  },
  build: {
    outDir: "build",
    sourcemap: true,
  },
});

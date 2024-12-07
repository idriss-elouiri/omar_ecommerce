import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ["sortablejs"],
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"], // Group large dependencies into a separate chunk
        },
      },
    },
  },
});

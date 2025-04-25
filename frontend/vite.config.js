import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
      },
    },
    allowedHosts: [
      "6aa3-2401-4900-8841-8eee-f1d7-2129-dda8-f66c.ngrok-free.app",
    ],
  },
});

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

const API_PORT = process.env.API_PORT ?? "3001";
/** Dev server only: `server` options are ignored by `vite build`; production uses `VITE_API_URL` / hosting. */
const apiTarget = `http://127.0.0.1:${API_PORT}`;

// https://vite.dev/config/
export default defineConfig({
  clearScreen: false,
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/api": {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
});

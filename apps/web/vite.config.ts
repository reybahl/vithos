import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { env } from "./vite-env-node";

/** Dev server only: ignored by `vite build`; prod uses `VITE_API_URL` / hosting. */
const apiTarget = `http://127.0.0.1:${env.API_PORT}`;

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

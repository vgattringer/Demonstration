import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    // React-Plugin: aktiviert JSX-Transform und Fast Refresh im Dev-Modus
    react(),
    // Tailwind v4 läuft als Vite-Plugin statt als PostCSS-Plugin
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Löst @/* auf ./src/* auf — passend zum tsconfig-Alias
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Proxy: Im Dev-Modus leitet Vite alle /api/* Requests ans .NET Backend weiter.
    // Dadurch sieht der Browser nur einen einzigen Origin (localhost:5173)
    // und es entstehen keine CORS-Probleme während der Entwicklung.
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
})

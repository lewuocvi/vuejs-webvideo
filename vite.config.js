import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [tailwindcss(), vue(), nodePolyfills()],
  server: {
    allowedHosts: ['localhost.emmcvietnam.com']
  }
});
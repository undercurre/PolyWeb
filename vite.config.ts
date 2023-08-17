import { defineConfig } from "vite";
import preset from './preset/preset';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [...preset],
});

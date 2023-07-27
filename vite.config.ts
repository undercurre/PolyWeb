import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import preset from './preset/preset'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [...preset.plugins],
  css: preset.css, 
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

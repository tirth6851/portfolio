import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  // Default '/' for Vercel/Netlify. For GitHub Pages project site use '/portfolio/'.
  base: '/',
  plugins: [react(), tailwindcss()],
  // three.js ships in the lazy-loaded scene chunk (~540 kB), so the default 500 kB warning is expected.
  build: { chunkSizeWarningLimit: 600 },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

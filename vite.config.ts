import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Use '/' when a custom domain is connected. The workflow sets
  // '/declarix-site/' so the default GitHub Pages project URL works today.
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react()],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Keep assets rooted for the custom domain.
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react()],
})

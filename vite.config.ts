import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Keep assets rooted for the custom domain.
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [
    react(),
    {
      name: 'declarix-webmaster-verification',
      transformIndexHtml(html) {
        const tags = [
          ['google-site-verification', process.env.VITE_GOOGLE_SITE_VERIFICATION],
          ['msvalidate.01', process.env.VITE_BING_SITE_VERIFICATION],
        ]
          .filter(([, value]) => Boolean(value))
          .map(([name, content]) => ({
            tag: 'meta',
            attrs: { name, content: content as string },
            injectTo: 'head' as const,
          }))
        return { html, tags }
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        // GSAP + its plugins are the heaviest vendor code and change far less
        // often than the app. Splitting them into their own chunk keeps the app
        // chunk small and lets the animation vendor stay cached across content
        // edits; it also downloads in parallel with the app chunk. (Lenis is not
        // listed here — it is dynamically imported and gets its own async chunk,
        // so the touch / reduced-motion / Save-Data paths never fetch it.)
        manualChunks(id) {
          if (id.includes('/node_modules/gsap/')) return 'gsap'
        },
      },
    },
  },
})

import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const page = (f: string) => fileURLToPath(new URL(f, import.meta.url))

// base './' keeps asset paths relative, so the build also works inside a mobile WebView (Capacitor)
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    // during development the API runs separately (bosmenti-server, port 3000)
    proxy: { '/api': 'http://localhost:3000', '/uploads': 'http://localhost:3000' },
  },
  build: {
    rollupOptions: { input: { main: page('./index.html'), admin: page('./admin.html') } },
  },
})

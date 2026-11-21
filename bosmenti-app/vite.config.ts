import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps asset paths relative, so the build also works inside a mobile WebView (Capacitor)
export default defineConfig({
  plugins: [react()],
  base: './',
})

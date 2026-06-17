import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Dev serves at "/", but the production build targets juanmnl.com/operator-app so every
// asset URL is emitted as /operator-app/... — drop the dist/ folder in at that path.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/operator-app/' : '/',
  plugins: [react(), tailwindcss()],
}))

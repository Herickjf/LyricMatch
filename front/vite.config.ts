import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite usar 0.0.0.0
    port: 3000
  },
  preview: {
    allowedHosts: ['lyricmatch.com.br']
  }
})

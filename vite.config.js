import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    allowedHosts: ['surround-kinswoman-anthill.ngrok-free.dev'],
    proxy: {
      '/equipment': 'http://127.0.0.1:8000',
      '/bookings': 'http://127.0.0.1:8000',
      '/payments': 'http://127.0.0.1:8000',
      '/chatbot': 'http://127.0.0.1:8000',
      '/maintenance': 'http://127.0.0.1:8000',
      '/health': 'http://127.0.0.1:8000',
      '/whoami': 'http://127.0.0.1:8000',
    },
  },
})
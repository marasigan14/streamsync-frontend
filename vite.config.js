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
      '/equipment': 'https://streamsync-backend-4cn7.onrender.com',
      '/bookings': 'https://streamsync-backend-4cn7.onrender.com',
      '/payments': 'https://streamsync-backend-4cn7.onrender.com',
      '/chatbot': 'https://streamsync-backend-4cn7.onrender.com',
      '/maintenance': 'https://streamsync-backend-4cn7.onrender.com',
      '/health': 'https://streamsync-backend-4cn7.onrender.com',
      '/whoami': 'https://streamsync-backend-4cn7.onrender.com',
    },
  },
})
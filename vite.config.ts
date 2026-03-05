import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Ignora erros de TypeScript durante build
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignora avisos de módulos não resolvidos
        if (warning.code === 'THIS_IS_UNDEFINED') return
        warn(warning)
      }
    }
  }
})

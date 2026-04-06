import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// v4 - force rebuild
export default defineConfig({
    plugins: [react()],
    base: '/',
    build: {
          rollupOptions: {
                  output: {
                            manualChunks: {
                                        vendor: ['react', 'react-dom'],
                                        charts: ['recharts'],
                            }
                  }
          }
    }
})

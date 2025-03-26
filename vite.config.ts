import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Login server API proxy
      '/api/v1': {
        target: 'http://localhost:4001',
        changeOrigin: true,
        secure: false,
      },
      // Edge server API proxy
      '/api/sensors': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/sensors/, '/api/sensors'),
        secure: false,
      },
      // Edge server auth API proxy
      '/api/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

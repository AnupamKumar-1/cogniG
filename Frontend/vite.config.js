import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy /auth to backend
      '^/auth/.*': {
        target: 'https://cognigbackend.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      // Proxy /api to backend
      '^/api/.*': {
        target: 'https://cognigbackend.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});

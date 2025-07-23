
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {

      '^/auth/.*': {
        target: 'https://cognig-backend.onrender.com',
        changeOrigin: true,
        secure: false,

      }
    }
  }
});

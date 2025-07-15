// /Frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // PROXY ANY /auth/* PATH to your Express server
      '^/auth/.*': {
        target: 'https://cognig-backend.onrender.com',
        changeOrigin: true,
        secure: false,
        // no rewrite: we want to forward /auth/me → /auth/me on backend
      }
    }
  }
});

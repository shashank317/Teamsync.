// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // All API calls will forward to FastAPI
      '/projects': 'http://localhost:8000',
      '/ai': 'http://localhost:8000',
      '/auth': 'http://localhost:8000',
      '/uploads': 'http://localhost:8000',
    },
  },
});

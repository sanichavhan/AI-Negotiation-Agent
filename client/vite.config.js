import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  define: {
    __VITE_API_URL__: JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3000'),
    __VITE_API_TIMEOUT__: JSON.stringify(process.env.VITE_API_TIMEOUT || '30000'),
  },
});

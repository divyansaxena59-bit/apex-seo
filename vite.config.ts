import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    middlewareMode: false,
  },
  build: {
    target: 'ES2020',
    outDir: 'dist',
    rollupOptions: {
      output: {
        dir: 'dist',
      },
    },
  },
  ssr: {
    external: ['@prisma/client'],
  },
});

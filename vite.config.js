import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // Esta linha 'root: 'static'' DEVE SER REMOVIDA OU COMENTADA
  build: {
    outDir: 'dist', // Isso vai criar a pasta 'dist' na raiz do projeto
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
  }
})

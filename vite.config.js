import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'static', // Isso diz à Vite que seu index.html e assets estão na pasta 'static'
  build: {
    outDir: 'dist', // MUDEI AQUI: Agora 'dist' será criado DENTRO da pasta 'static'
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

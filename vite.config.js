import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // Certifique-se de que esta linha está no topo

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'static', // Isso diz à Vite que seu index.html e assets estão na pasta 'static'
  build: {
    // MUDEI AQUI: outDir agora aponta para a pasta 'dist' na raiz do projeto
    outDir: path.resolve(__dirname, 'dist'),
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

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // REMOVA OU COMENTE ESTA LINHA: root: 'static',
  build: {
    // MUDEI AQUI: outDir agora aponta diretamente para a raiz do projeto
    outDir: 'dist', // Isso fará com que a pasta 'dist' seja criada na raiz do projeto
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // MUDEI AQUI: O alias agora aponta para a pasta 'src' na raiz do projeto
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
  }
})

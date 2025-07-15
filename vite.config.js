import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // A linha 'root: 'static'' deve estar removida ou comentada.
  build: {
    // MUDEI AQUI: A Vite vai gerar os arquivos diretamente na raiz do projeto (temporariamente)
    outDir: '.', // Isso fará com que index.html e assets/ fiquem na raiz
    emptyOutDir: true, // Isso garantirá que a pasta seja limpa
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

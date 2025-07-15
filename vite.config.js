import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: Esta linha 'root: 'static'' DEVE SER REMOVIDA ou COMENTADA
  // root: 'static',
  build: {
    // ESSA LINHA É A CHAVE: Diz à Vite para colocar os arquivos de build diretamente na raiz
    outDir: '.',
    emptyOutDir: true, // Garante que a pasta de saída seja limpa
  },
  resolve: {
    alias: {
      // O alias deve apontar para a pasta 'src' na raiz do projeto
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: Esta linha 'root: 'static'' DEVE SER REMOVIDA ou COMENTADA
  // root: 'static',
  build: {
    // ESTA É A ÚNICA LINHA 'outDir' que deve existir no bloco 'build'
    outDir: 'dist', // Diz à Vite para colocar os arquivos de build DENTRO da pasta 'dist'
    emptyOutDir: true, // Garante que a pasta dist seja limpa antes de cada build
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

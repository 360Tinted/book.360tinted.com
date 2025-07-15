import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // IMPORTANTE: Adicione esta linha

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'static', // Isso diz à Vite que seu index.html e assets estão na pasta 'static'
  build: {
    outDir: '../dist', // Isso diz à Vite para colocar a pasta 'dist' um nível acima da pasta 'root' (ou seja, na raiz do projeto)
    emptyOutDir: true, // Garante que a pasta dist seja limpa antes de cada build
  },
  resolve: { // IMPORTANTE: Adicione esta seção
    alias: {
      '@': path.resolve(__dirname, './src'), // Isso mapeia '@/' para a pasta 'src'
    },
  },
  server: {
    host: true, // Permite acesso via IP na rede local
    port: 5173, // Porta padrão do Vite
  }
})
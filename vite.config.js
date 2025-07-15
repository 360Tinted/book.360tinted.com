import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'static', // Isso diz à Vite que seu index.html e assets estão na pasta 'static'
  build: {
    outDir: '../dist', // ISSO É O NOVO: Diz à Vite para colocar a pasta 'dist' um nível acima da pasta 'root' (ou seja, na raiz do projeto)
    emptyOutDir: true, // Garante que a pasta dist seja limpa antes de cada build
  },
  server: {
    host: true, // Permite acesso via IP na rede local
    port: 5173, // Porta padrão do Vite
  }
})
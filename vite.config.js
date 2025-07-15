import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Importar o módulo 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'static', // Manter esta linha
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Adicionar esta seção
    },
  },
  build: {
    outDir: '../dist', // Manter esta linha
  },
})
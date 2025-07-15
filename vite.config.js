import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // REMOVA OU COMENTE a linha: root: 'static',
  build: {
    outDir: 'dist', // ESSA LINHA É CRUCIAL: Faz a Vite criar a pasta 'dist'
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

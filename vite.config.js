import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // Certifique-se de que esta linha está no topo

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // root: 'static', // Esta linha deve estar comentada ou removida
  build: {
    outDir: 'dist', // Isso fará com que a pasta 'dist' seja criada na raiz do projeto
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
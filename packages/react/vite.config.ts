import path from 'node:path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'dev',
  plugins: [react()],
  resolve: {
    alias: {
      '@pickolor/core': path.resolve(__dirname, '../core/src'),
      '@pickolor/react': path.resolve(__dirname, './src'),
      '@pickolor/styles': path.resolve(__dirname, '../styles/src'),
    },
  },
  server: {
    port: 4173,
  },
})

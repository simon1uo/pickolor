import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@pickolor/core': path.resolve(__dirname, '../../packages/core/src'),
      '@pickolor/react': path.resolve(__dirname, '../../packages/react/src'),
      '@pickolor/styles': path.resolve(__dirname, '../../packages/styles/src'),
    },
  },
})

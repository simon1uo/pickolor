import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'dev',
  plugins: [vue()],
  resolve: {
    alias: {
      '@pickolor/core': path.resolve(__dirname, '../core/src'),
      '@pickolor/vue': path.resolve(__dirname, './src'),
      '@pickolor/styles': path.resolve(__dirname, '../styles/src'),
    },
  },
  server: {
    port: 4174,
  },
})

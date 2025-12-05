import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@pickolor/core': path.resolve(__dirname, '../../packages/core/src'),
      '@pickolor/vue': path.resolve(__dirname, '../../packages/vue/src'),
      '@pickolor/styles': path.resolve(__dirname, '../../packages/styles/src'),
    },
  },
})

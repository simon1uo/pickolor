import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [
      fileURLToPath(new URL('./packages/core/tests/setup.ts', import.meta.url)),
    ],
    include: [
      'packages/**/*.test.{ts,tsx,js,jsx}',
      'packages/**/*.spec.{ts,tsx,js,jsx}',
    ],
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
})

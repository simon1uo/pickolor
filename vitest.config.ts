import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['packages/core/tests/setup.ts'],
    include: ['packages/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
})

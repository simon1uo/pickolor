import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [
      fileURLToPath(new URL('../../tests/setup.ts', import.meta.url)),
    ],
    include: [
      'tests/**/*.test.{ts,tsx,js,jsx}',
      'tests/**/*.spec.{ts,tsx,js,jsx}',
    ],
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
})

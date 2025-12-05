import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
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

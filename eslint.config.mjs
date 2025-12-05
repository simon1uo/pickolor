import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  react: true,
  pnpm: false,
  ignores: [
    'node_modules',
    '**/dist/**',
    '**/build/**',
    'coverage/**',
    'packages/*/dist/**',
    'examples/**/dist/**',
    '**/*.min.js',
    '.specify/**',
    'specs/**',
    '.codex/**',
  ],
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
})

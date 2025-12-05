import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'node_modules',
    '**/dist/**',
    '**/build/**',
    'coverage/**',
    'examples/**/dist/**',
    '**/*.min.js',
    '.specify/**',
    'specs/**',
    '.codex/**',
    'pnpm-workspace.yaml'
  ],
})

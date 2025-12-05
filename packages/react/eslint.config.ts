import antfu from '@antfu/eslint-config'

export default antfu({ 
  react: true, 
  ignores: [
    'node_modules',
    'dist/**',
    'build/**',
    'coverage/**',
    '**/*.min.js',
  ],
})

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
  rules: {
    'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
    'react-hooks/exhaustive-deps': 'off',
  },
})

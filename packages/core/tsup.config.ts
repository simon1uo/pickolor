import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  tsconfig: 'tsconfig.build.json',
  outExtension: ({ format }) => (format === 'esm' ? { js: '.mjs' } : { js: '.cjs' }),
  sourcemap: true,
  clean: true,
  target: 'es2020',
  minify: false,
  splitting: false,
  external: ['colord'],
  treeshake: true,
})

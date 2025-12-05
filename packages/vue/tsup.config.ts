import { resolve } from 'node:path'
import { defineConfig } from 'tsup'
import vue from 'unplugin-vue/esbuild'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: false,
  tsconfig: resolve(__dirname, 'tsconfig.build.json'),
  sourcemap: true,
  clean: true,
  target: 'es2020',
  minify: false,
  splitting: false,
  external: ['vue', '@pickolor/core'],
  treeshake: true,
  esbuildPlugins: [vue()],
})

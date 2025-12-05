# pickolor Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-12-04

## Active Technologies

- TypeScript 5.x，Node ≥18 + colord（色彩引擎，通过适配层调用）、Vite（开发/示例）、tsup（打包）、React 18.2 壳层、Vue 3.3 壳层 (001-init-color-monorepo)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

- TypeScript 5.x，Node ≥18: Follow standard conventions
- ESLint: 使用 `@antfu/eslint-config` 作为基线，集中配置于 `eslint.config.js`；不引入 Prettier，不需要 `.eslintignore`。

## Recent Changes
- 002-colorpicker-unify: Added [if applicable, e.g., PostgreSQL, CoreData, files or N/A]

- 001-init-color-monorepo: Added TypeScript 5.x，Node ≥18 + colord（色彩引擎，通过适配层调用）、Vite（开发/示例）、tsup（打包）、React 18.2 壳层、Vue 3.3 壳层

<!-- MANUAL ADDITIONS START -->
- pnpm workspace，多包 core/react/vue/styles；dev/build/test 以 pnpm 运行。
<!-- MANUAL ADDITIONS END -->

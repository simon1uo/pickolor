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

- 001-init-color-monorepo: Added TypeScript 5.x，Node ≥18 + colord（色彩引擎，通过适配层调用）、Vite（开发/示例）、tsup（打包）、React 18.2 壳层、Vue 3.3 壳层

<!-- MANUAL ADDITIONS START -->
- pnpm workspace，多包 core/react/vue/styles；dev/build/test 以 pnpm 运行。
- 构建输出需保持 ESM+CJS + d.ts，并标注 sideEffects 便于 tree-shaking。
- 核心包体积目标：gzip ≤30KB，运行时依赖 ≤2；壳层 gzip ≤25KB，额外依赖 ≤1。
- 跨框架兼容：React ≥18.2、Vue ≥3.3，支持 CSR + Vite SSR，Node ≥18。
- API 稳定性：遵循 SemVer，破坏性变更仅主版本，提前 2 周公告并提供迁移指南。
- 插件/错误契约：插件需唯一名称与适用空间；错误信息需类型、分量/字段、可读描述（≥15 字）、错误码。
<!-- MANUAL ADDITIONS END -->

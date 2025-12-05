# Pickolor Monorepo

A lightweight, cross-framework color toolkit built as a pnpm workspace. The repo hosts four packages:

- `@pickolor/core`: Headless parsing/formatting/transform primitives (colord-adapted).
- `@pickolor/react`: Thin React bindings around the core utilities.
- `@pickolor/vue`: Thin Vue bindings around the core utilities.
- `@pickolor/styles`: Optional, tree-shakeable CSS variables and styling helpers.

## Workspace layout

```
packages/
  core/
  react/
  vue/
  styles/
examples/
  react/
  vue/
configs/
scripts/
tests/
```

## Development scripts

- `pnpm install` to bootstrap the workspace.
- `pnpm dev:react` / `pnpm dev:vue` start the Vite example apps.
- `pnpm lint`, `pnpm test`, `pnpm build` run repo-wide lint, tests, and builds (configured per package).

## Requirements

- Node.js >= 18
- pnpm >= 8

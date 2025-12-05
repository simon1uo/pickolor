# Vue Demo Self-Test Guide

## Prerequisites
- Node.js >= 18, pnpm >= 8
- Run `pnpm install` at repo root

## Start and access
- From repo root: `pnpm dev:vue`
- Uses the Vite dev server (http://localhost:5173) with entry at `packages/vue/dev/`
- To run alongside the React demo: `pnpm --filter @pickolor/vue dev -- --port 5175`

## What to verify
- `v-model` sync: inputs/picker updates propagate to `color`, preset buttons update component state back
- `@change` returns a model that can be passed to formatters; background reacts to `color` changes
- Preset buttons switch correctly with no console errors; invalid input triggers `@error` with structured error

## Useful scripts
- Lint: `pnpm --filter @pickolor/vue lint`
- Tests: `pnpm --filter @pickolor/vue test`

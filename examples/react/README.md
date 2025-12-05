# React Demo Self-Test Guide

## Prerequisites
- Node.js >= 18, pnpm >= 8
- Run `pnpm install` at repo root

## Start and access
- From repo root: `pnpm dev:react`
- Uses the Vite dev server (http://localhost:5173) with entry at `packages/react/dev/`
- To run alongside the Vue demo: `pnpm --filter @pickolor/react dev -- --port 5174`

## What to verify
- Default `#ff8800` renders without console errors
- Typing/pasting HEX or RGB/HSL/OKLCH strings updates background/preview live
- Preset buttons switch values; `onChange` returns a `ColorModel` consumable by `formatColor`
- Invalid input triggers `onError` with structured error (code/type/field/message)

## Useful scripts
- Lint: `pnpm --filter @pickolor/react lint`
- Tests: `pnpm --filter @pickolor/react test`

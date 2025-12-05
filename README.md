# Pickolor Monorepo

A lightweight, cross-framework color toolkit maintained as a pnpm workspace with four packages:

- `@pickolor/core`: Pure parse/format/transform functions (colord adapter underneath).
- `@pickolor/react`: Thin React 18 shell; controlled input, callbacks return `ColorModel`.
- `@pickolor/vue`: Thin Vue 3 shell with `v-model` support (`modelValue` + `update:modelValue`).
- `@pickolor/styles`: Optional CSS variables and base styles, decoupled from core/shells.

## Quickstart (for consumers)
```bash
pnpm add @pickolor/core @pickolor/react @pickolor/vue @pickolor/styles
```
Core example:
```ts
import { parseColor, transformColor, formatColor } from '@pickolor/core';

const model = parseColor('#ff8800');
const next = transformColor(model, [{ type: 'lighten', value: 0.1 }]);
const out = formatColor(next, { target: 'rgba', includeAlpha: true });
```
More examples (React/Vue usage, error contract) live in `specs/001-init-color-monorepo/quickstart.md`.

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
- `pnpm install`: bootstrap dependencies
- `pnpm dev:react` / `pnpm dev:vue`: run Vite demos
- `pnpm lint`, `pnpm test`, `pnpm build`: repo-wide lint/test/build

## Constraints and requirements
- Runtime targets: Node >= 18, React >= 18.2, Vue >= 3.3
- Outputs: publish ESM + CJS + d.ts with `sideEffects` for tree-shaking
- Size/deps: core gzip ≤30KB, runtime deps ≤2; React/Vue shells gzip ≤25KB, extra deps ≤1
- Versioning: SemVer; breaking changes only in major releases with 2-week advance notice and migration guides

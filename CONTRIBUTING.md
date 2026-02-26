# Contributing to Pickolor

Thanks for taking the time to contribute. This repo is a pnpm monorepo with four packages under `packages/*`.

## Prerequisites
- Node.js >= 18
- pnpm >= 9 (see `package.json`)

## Getting started
```bash
pnpm install
```

## Common scripts
```bash
pnpm lint
pnpm test
pnpm build
pnpm dev:react
pnpm dev:vue
```

## Changesets (required for publishable changes)
If you change anything under `packages/**`, or modify root `package.json` or `pnpm-workspace.yaml`, you must add a changeset:
```bash
pnpm changeset
```
CI will fail if a changeset is required but missing (`scripts/ci/check-changeset.mjs`).

## Packages and boundaries
- `@pickolor/core` is the single source of truth for color math and error contracts.
- `@pickolor/react` and `@pickolor/vue` are UI shells and should not reimplement parse/format logic.
- `@pickolor/styles` is CSS-only and should remain framework-agnostic.

## Tests
- Core tests live in `packages/core/tests`.
- UI tests live in `packages/react/tests` and `packages/vue/tests`.
- Shared setup is in `tests/setup.ts`.

## Release checks (for maintainers)
Release requires `dist/`, `README.md`, and `LICENSE` in each package. See `docs/release.md`.

# PROJECT KNOWLEDGE BASE

## OVERVIEW
Pickolor is a pnpm monorepo for a cross-framework color toolkit: pure core transforms plus thin React/Vue UI shells and an optional CSS package.
Build/test/lint and release gates are centralized at repo root; package internals stay isolated by `packages/*` boundaries.

## STRUCTURE
```text
pickolor/
├── packages/
│   ├── core/      # parse/format/transform + plugin registry
│   ├── react/     # React ColorPicker shell
│   ├── vue/       # Vue ColorPicker shell
│   └── styles/    # shared CSS variables and class rules
├── configs/       # shared tsconfig presets
├── scripts/       # CI/release guards (changeset + artifacts)
├── tests/         # shared Vitest setup
├── .github/workflows/
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Core parsing/format/transform | `packages/core/src` | Public API exported from `packages/core/src/index.ts` |
| React picker behavior | `packages/react/src/ColorPicker.tsx` | Uses context + hooks + portal popover |
| Vue picker behavior | `packages/vue/src/ColorPicker.vue` | State is split into composables |
| Shared styles/tokens | `packages/styles/src/styles.css` | React/Vue class selectors live together |
| CI checks | `scripts/ci/check-changeset.mjs` | Fails PRs missing changesets for publishable changes |
| Release guard | `scripts/release/check-artifacts.mjs` | Requires `dist/`, `README.md`, `LICENSE` per package |
| Repo commands | `package.json` | Root scripts orchestrate all packages via pnpm |

## CODE MAP
LSP symbols were unavailable in this environment (`typescript-language-server` missing), so map is derived from source exports.

| Symbol | Type | Location | Role |
|--------|------|----------|------|
| `parseColor` | function | `packages/core/src/parse.ts` | Input string -> normalized `ColorModel` |
| `formatColor` | function | `packages/core/src/format.ts` | `ColorModel` -> target format string |
| `transformColor` | function | `packages/core/src/transform.ts` | Applies ordered transform steps |
| `registerPlugin` | function | `packages/core/src/plugins.ts` | Extends parse/format/transform pipeline |
| `ColorPicker` | React component | `packages/react/src/ColorPicker.tsx` | Controlled/uncontrolled picker shell |
| `ColorPicker` | Vue SFC | `packages/vue/src/ColorPicker.vue` | `v-model` picker shell |

## CONVENTIONS
- Monorepo commands run through root scripts (`pnpm -r ...`); avoid ad-hoc per-package command drift.
- Every package keeps its own `eslint.config.ts`, while root config defines global ignores.
- Test configs are package-local (`packages/*/vitest.config.ts`) but all point to shared setup `tests/setup.ts`.
- React/Vue dev servers use `vite.config.ts` with `root: 'dev'` and source aliases to sibling packages.
- TypeScript path aliases for `@pickolor/*` are defined at root `tsconfig.json` for workspace-local development.

## ANTI-PATTERNS (THIS PROJECT)
- Do not change `packages/**`, root `package.json`, or `pnpm-workspace.yaml` in PRs without a `.changeset/*` entry.
- Do not publish/release without generated `dist/` output for each package.
- Do not remove package `README.md` or `LICENSE`; release gate treats missing files as a hard failure.
- Do not move demo assets into `src/`; keep playground apps under each package `dev/` folder.

## UNIQUE STYLES
- Core package is intentionally framework-free; React/Vue shells should delegate color math to `@pickolor/core`.
- `@pickolor/styles` is optional and decoupled from runtime logic; CSS import is consumer-controlled.
- Release pipeline is changeset-first: versioning and publish are driven by changesets rather than manual version bumps.

## COMMANDS
```bash
pnpm install
pnpm lint
pnpm test
pnpm build
pnpm dev:react
pnpm dev:vue
pnpm ci:changeset
pnpm release:check
pnpm release:dry
```

## NOTES
- Root `lint` script runs with `--fix`; expect local file rewrites.
- Vue package build emits declarations via `vue-tsc` after `tsup`.
- Styles package build is a file copy (`src/styles.css` -> `dist/styles.css`), not a bundler pipeline.
- CI on PR enforces changeset policy before lint/test/build.

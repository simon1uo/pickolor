# CORE KNOWLEDGE BASE

## OVERVIEW
`@pickolor/core` is the framework-free color engine; every UI package should treat it as the single source of color math and error contracts.

## STRUCTURE
```text
packages/core/
├── src/
│   ├── parse.ts
│   ├── format.ts
│   ├── transform.ts
│   ├── plugins.ts
│   ├── types.ts
│   ├── errors.ts
│   └── index.ts
├── tests/
│   ├── parse-format.spec.ts
│   └── transform.spec.ts
└── tsup.config.ts
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Parse input strings | `src/parse.ts` | Normalizes to HSV-based `ColorModel` |
| Format output strings | `src/format.ts` | Handles alpha mapping and target output |
| Apply transforms | `src/transform.ts` | Ordered step execution with range checks |
| Extend behavior | `src/plugins.ts` | Parse/format/transform plugin hooks |
| Error contract | `src/errors.ts`, `src/types.ts` | `ColorError` shape is consumed by shells |
| Public API surface | `src/index.ts` | Export barrel; keep this stable |
| Regression tests | `tests/*.spec.ts` | Current coverage focuses on parse/format/transform |

## CONVENTIONS
- Keep model internals HSV-based (`h/s/v/a`) and round to local precision constants.
- Throw structured errors (`type`, `code`, `message`) instead of raw Error in public operations.
- Validate transform ranges via `assertWithinRange` for user-facing steps.
- Add new public capabilities by exporting from `src/index.ts` only after tests exist.
- Plugin registry is process-local; do not make registration implicit during imports.

## ANTI-PATTERNS
- Do not import React/Vue APIs into `packages/core`.
- Do not bypass `createError` when introducing new parse/format/transform failures.
- Do not mutate incoming models in transform pipelines; return new objects.
- Do not add shell-specific output assumptions into core format logic.

## COMMANDS
```bash
pnpm --filter @pickolor/core lint
pnpm --filter @pickolor/core test
pnpm --filter @pickolor/core build
```

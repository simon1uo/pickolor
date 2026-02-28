# CORE KNOWLEDGE BASE
## OVERVIEW
`@pickolor/core` is the framework-free color engine; every UI package should treat it as the single source of color math and error contracts.
## STRUCTURE
```text
packages/core/
├── src/
│   ├── parse.ts       # string → ColorModel (colord adapter)
│   ├── format.ts      # ColorModel → target string
│   ├── transform.ts   # ordered step pipeline (lighten/darken/saturate/hueShift/alpha)
│   ├── plugins.ts     # parse/format/transform extension registry
│   ├── cmyk.ts        # CMYK ↔ RGB conversion helpers
│   ├── types.ts       # ColorModel, Plugin, FormatType, Transformation, ColorError
│   ├── errors.ts      # createError / throwError factory
│   ├── utils.ts       # clamp()
│   └── index.ts       # barrel re-export of all modules
├── tests/
│   ├── parse-format.spec.ts
│   └── transform.spec.ts
└── tsup.config.ts
```
## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Parse input strings | `src/parse.ts` | Normalizes to HSV-based `ColorModel` via colord |
| Format output strings | `src/format.ts` | Alpha mapping + target dispatch; OKLCH not yet supported |
| Apply transforms | `src/transform.ts` | Ordered step execution with `assertWithinRange` checks |
| Extend behavior | `src/plugins.ts` | First-match plugin registry (parse/format/transform hooks) |
| CMYK support | `src/cmyk.ts` | `rgbToCmyk`, `cmykToRgb`, `cmykInputToColor` |
| Error contract | `src/errors.ts`, `src/types.ts` | `ColorError` shape (`type/code/field/message`) consumed by shells |
| Public API surface | `src/index.ts` | Export barrel; keep this stable |
| Regression tests | `tests/*.spec.ts` | Coverage focuses on parse/format/transform |
## CODE MAP
| Symbol | Type | Role |
|--------|------|------|
| `parseColor` | function | Input string → `ColorModel` (HSV-based, s/v normalized 0–1) |
| `formatColor` | function | `ColorModel` → target format string |
| `transformColor` | function | Applies `Transformation[]` steps sequentially |
| `registerPlugin` | function | Adds plugin to process-local registry (name must be unique) |
| `createError` / `throwError` | function | Structured error factory (min 15-char message) |
| `assertWithinRange` | function | Validates step value against `TRANSFORM_RANGES` |
| `clamp` | function | Generic numeric clamp utility |
| `rgbToCmyk` / `cmykToRgb` | function | CMYK ↔ RGB conversion |
| `ColorModel` | interface | `{ h, s, v, a, format, source }` — s/v are 0–1, h is 0–360 |
| `Plugin` | interface | `{ name, supports?, parse?, format?, transform? }` |
| `FormatType` | type | `hex \| hex8 \| rgba \| rgb \| hsla \| hsl \| hsv \| hsva \| cmyk \| css \| oklch` |
| `Transformation` | interface | `{ type: TransformationType, value: number }` |
## CONVENTIONS
- Model internals are HSV-based (`h/s/v/a`); s and v are 0–1, h is 0–360.
- `colord` is the sole runtime dependency; all color math routes through it.
- Throw structured errors via `createError`; never raw `Error` in public ops.
- Validate transform ranges via `assertWithinRange` for user-facing steps.
- Add new public capabilities by exporting from `src/index.ts` only after tests exist.
- Plugin registry is process-local; do not make registration implicit during imports.
- Transform pipeline returns new objects; never mutate incoming models.
## ANTI-PATTERNS
- Do not import React/Vue APIs into `packages/core`.
- Do not bypass `createError` when introducing new parse/format/transform failures.
- Do not mutate incoming models in transform pipelines; return new objects.
- Do not add shell-specific output assumptions into core format logic.
- Do not add runtime dependencies beyond `colord` without size budget review (gzip ≤ 30KB, ≤ 2 deps).
## NOTES
- OKLCH format is declared in `FormatType` but `formatColor` throws `UNSUPPORTED_TARGET` for it.
- `ALPHA_FORMAT_MAP` in format.ts auto-upgrades `hex→hex8`, `rgb→rgba`, `hsl→hsla`, `hsv→hsva` when `includeAlpha` is true.
- Precision is clamped 0–6; default is 2.
## COMMANDS
```bash
pnpm --filter @pickolor/core lint
pnpm --filter @pickolor/core test
pnpm --filter @pickolor/core build
```
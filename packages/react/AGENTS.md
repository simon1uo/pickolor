# REACT KNOWLEDGE BASE

## OVERVIEW
`@pickolor/react` is a thin shell around `@pickolor/core`; UI state and interaction stay here, color math stays in core.

## STRUCTURE
```text
packages/react/
├── src/
│   ├── ColorPicker.tsx
│   ├── components/
│   ├── hooks/
│   ├── context/
│   └── index.ts
├── dev/
│   └── App.tsx
├── vite.config.ts
└── tsup.config.ts
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Public export | `src/index.ts` | Exposes `ColorPicker` |
| Main component logic | `src/ColorPicker.tsx` | Controlled/uncontrolled input + portal popover |
| Popover behavior | `src/hooks/usePopover.ts` | Floating UI wiring and outside-click handling |
| Slider interactions | `src/components/Slider.tsx` | Pointer + keyboard channel updates |
| Saturation plane | `src/components/SaturationPanel.tsx` | 2D drag-to-update S/V |
| Shared model context | `src/context/color.tsx` | Channel setters used by child controls |

## CONVENTIONS
- Parse/format via `@pickolor/core` only; avoid duplicate color calculations in components.
- Keep component API centered on `value/modelValue/defaultValue` and `onChange/onError`.
- Popover attach/placement behavior lives in `usePopover`, not scattered across components.
- Shared slider semantics (pointer, keyboard, step rounding) should stay in `components/Slider.tsx`.
- Use `dev/` playground for manual UI validation; keep demo assets out of `src/`.

## ANTI-PATTERNS
- Do not introduce React-only color model types that diverge from core `ColorModel`.
- Do not write direct DOM listeners in multiple components when hook-level behavior exists.
- Do not import styles package logic into runtime TS; styles are consumer-imported CSS.
- Do not skip error propagation to `onError` when parse/format fails.

## COMMANDS
```bash
pnpm --filter @pickolor/react dev
pnpm --filter @pickolor/react lint
pnpm --filter @pickolor/react test
pnpm --filter @pickolor/react build
```

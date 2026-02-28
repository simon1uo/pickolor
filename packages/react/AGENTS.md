# REACT KNOWLEDGE BASE
## OVERVIEW
`@pickolor/react` is a thin shell around `@pickolor/core`; UI state and interaction stay here, color math stays in core.
## STRUCTURE
```text
packages/react/
├── src/
│   ├── ColorPicker.tsx        # main component (controlled/uncontrolled + portal popover)
│   ├── components/
│   │   ├── Slider.tsx          # base pointer+keyboard slider primitive
│   │   ├── HueSlider.tsx       # hue channel (wraps Slider)
│   │   ├── AlphaSlider.tsx     # alpha channel (wraps Slider)
│   │   └── SaturationPanel.tsx # 2D drag-to-update S/V
│   ├── hooks/
│   │   ├── usePopover.ts       # @floating-ui/react wiring + outside-click
│   │   ├── useElementSize.ts   # ResizeObserver-based dimension tracking
│   │   └── useThrottleFn.ts    # generic throttle wrapper
│   ├── context/color.tsx       # ColorControlContext (model + channel setters)
│   └── index.ts
├── dev/                        # Vite playground (root: 'dev')
├── vite.config.ts
└── tsup.config.ts
```
## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Public export | `src/index.ts` | Exposes `ColorPicker` only |
| Main component logic | `src/ColorPicker.tsx` | Controlled/uncontrolled input + portal popover |
| Popover behavior | `src/hooks/usePopover.ts` | Floating UI wiring and outside-click handling |
| Slider interactions | `src/components/Slider.tsx` | Pointer + keyboard channel updates |
| Saturation plane | `src/components/SaturationPanel.tsx` | 2D drag-to-update S/V |
| Shared model context | `src/context/color.tsx` | `ColorControlContext` with channel setters (`h/s/v/a`) |
| Element sizing | `src/hooks/useElementSize.ts` | ResizeObserver hook for slider/panel dimensions |
## CONVENTIONS
- Parse/format via `@pickolor/core` only; no duplicate color calculations.
- Component API: `value/modelValue/defaultValue` + `onChange/onError`.
- Popover attach/placement lives in `usePopover`, not scattered across components.
- Shared slider semantics (pointer, keyboard, step rounding) stay in `components/Slider.tsx`.
- `stabilizeModel` preserves hue when saturation is 0; preserves all channels when value is 0.
- Popover uses `createPortal` to configurable attach target (default: `document.body`).
## ANTI-PATTERNS
- Do not introduce React-only color model types that diverge from core `ColorModel`.
- Do not write direct DOM listeners in multiple components when hook-level behavior exists.
- Do not import styles package logic into runtime TS; styles are consumer-imported CSS.
- Do not skip error propagation to `onError` when parse/format fails.
- Do not add dependencies beyond `@floating-ui/react` (gzip ≤ 25KB, ≤ 1 extra dep).
## NOTES
- Peer deps: `@pickolor/core` (workspace), `react` ≥ 18.2, `react-dom` ≥ 18.2.
- Build via `tsup`; outputs ESM + CJS + d.ts. Dev server uses `@vitejs/plugin-react-swc`.
## COMMANDS
```bash
pnpm --filter @pickolor/react dev
pnpm --filter @pickolor/react lint
pnpm --filter @pickolor/react test
pnpm --filter @pickolor/react build
```
# VUE KNOWLEDGE BASE
## OVERVIEW
`@pickolor/vue` mirrors React shell behavior with Vue composables and SFC controls while delegating all color math to `@pickolor/core`.
## STRUCTURE
```text
packages/vue/
├── src/
│   ├── ColorPicker.vue         # main SFC (input + Teleport popover + composable wiring)
│   ├── components/
│   │   ├── Slider.vue           # base pointer+keyboard slider primitive
│   │   ├── HueSlider.vue        # hue channel (wraps Slider)
│   │   ├── AlphaSlider.vue      # alpha channel (wraps Slider)
│   │   ├── SaturationPanel.vue  # 2D drag-to-update S/V
│   │   └── index.ts             # component barrel export
│   ├── composable/
│   │   ├── useInputModel.ts     # controlled/uncontrolled bridge + emit wiring
│   │   ├── usePopover.ts        # @floating-ui/vue lifecycle + close rules
│   │   └── useControlContext.ts # provide/inject for child controls
│   ├── context/color.ts         # injection key + context type
│   └── index.ts
├── dev/                         # Vite playground (root: 'dev')
├── vite.config.ts
└── tsup.config.ts
```
## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Public export | `src/index.ts` | Exposes `ColorPicker` + components |
| Main picker SFC | `src/ColorPicker.vue` | Input, Teleport popover, composable wiring |
| Input/model sync | `src/composable/useInputModel.ts` | Controlled/uncontrolled bridge + emits |
| Popover behavior | `src/composable/usePopover.ts` | Floating UI lifecycle and close rules |
| Context injection | `src/composable/useControlContext.ts`, `src/context/color.ts` | Provide/inject for controls |
| Shared slider SFC | `src/components/Slider.vue` | Base interaction primitive for hue/alpha |
| Component barrel | `src/components/index.ts` | Re-exports all sub-components |
## CONVENTIONS
- Use composables for behavior (`useInputModel`, `usePopover`), keep SFCs declarative.
- Emit both `update:modelValue` and semantic `change`/`error` events for consumer compatibility.
- Keep control context contract aligned with React shell channel semantics (`h/s/v/a`).
- Use `Teleport` attach target from popover config rather than hardcoded DOM assumptions.
- Maintain component barrel in `src/components/index.ts` when adding new controls.
- Uses `@vueuse/core` for reactive utilities; `@floating-ui/vue` for positioning.
## ANTI-PATTERNS
- Do not implement duplicate parse/format logic in Vue components.
- Do not bypass composables with ad-hoc watcher chains in `ColorPicker.vue`.
- Do not change emit payload shapes without matching React/core contract updates.
- Do not add package-private CSS assumptions; class names must remain shared-style compatible.
- Do not add dependencies beyond `@floating-ui/vue` + `@vueuse/core` (gzip ≤ 25KB, ≤ 1 extra dep).
## NOTES
- Peer deps: `@pickolor/core` (workspace), `vue` ≥ 3.3.
- Build: `tsup` then `vue-tsc --emitDeclarationOnly` for Vue-aware d.ts.
- Dev server uses `@vitejs/plugin-vue`.
## COMMANDS
```bash
pnpm --filter @pickolor/vue dev
pnpm --filter @pickolor/vue lint
pnpm --filter @pickolor/vue test
pnpm --filter @pickolor/vue build
```
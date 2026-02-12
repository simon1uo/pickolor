# VUE KNOWLEDGE BASE

## OVERVIEW
`@pickolor/vue` mirrors React shell behavior with Vue composables and SFC controls while delegating all color math to `@pickolor/core`.

## STRUCTURE
```text
packages/vue/
├── src/
│   ├── ColorPicker.vue
│   ├── components/
│   ├── composable/
│   ├── context/
│   └── index.ts
├── dev/
│   └── App.vue
├── vite.config.ts
└── tsup.config.ts
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Public export | `src/index.ts` | Exposes default `ColorPicker` + components |
| Main picker SFC | `src/ColorPicker.vue` | Input, teleport popover, composable wiring |
| Input/model sync | `src/composable/useInputModel.ts` | Controlled/uncontrolled bridge + emits |
| Popover behavior | `src/composable/usePopover.ts` | Floating UI lifecycle and close rules |
| Context injection | `src/composable/useControlContext.ts`, `src/context/color.ts` | Provide/inject API for controls |
| Shared slider SFC | `src/components/Slider.vue` | Base interaction primitive for hue/alpha |

## CONVENTIONS
- Use composables for behavior (`useInputModel`, `usePopover`), keep SFCs declarative.
- Emit both `update:modelValue` and semantic change events for consumer compatibility.
- Keep control context contract aligned with React shell channel semantics (`h/s/v/a`).
- Use `Teleport` attach target from popover config rather than hardcoded DOM assumptions.
- Maintain component barrel in `src/components/index.ts` when adding new controls.

## ANTI-PATTERNS
- Do not implement duplicate parse/format logic in Vue components.
- Do not bypass composables with ad-hoc watcher chains in `ColorPicker.vue`.
- Do not change emit payload shapes without matching React/core contract updates.
- Do not add package-private CSS assumptions; class names must remain shared-style compatible.

## COMMANDS
```bash
pnpm --filter @pickolor/vue dev
pnpm --filter @pickolor/vue lint
pnpm --filter @pickolor/vue test
pnpm --filter @pickolor/vue build
```

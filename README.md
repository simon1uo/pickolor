# Pickolor Monorepo

A lightweight, cross-framework color toolkit maintained as a pnpm workspace with four packages:

- `@pickolor/core`: Pure parse/format/transform functions (colord adapter underneath).
- `@pickolor/react`: Thin React 18 shell; controlled input, callbacks return `ColorModel`.
- `@pickolor/vue`: Thin Vue 3 shell with `v-model` support (`modelValue` + `update:modelValue`).
- `@pickolor/styles`: Optional CSS variables and base styles, decoupled from core/shells.

## Installation
```bash
pnpm add @pickolor/core @pickolor/react @pickolor/vue @pickolor/styles
```
Install only what you need, e.g. `pnpm add @pickolor/core` or `pnpm add @pickolor/react`.

## Usage
### Core
```ts
import { formatColor, parseColor, transformColor } from '@pickolor/core'

const model = parseColor('#ff8800')
const next = transformColor(model, [{ type: 'lighten', value: 0.1 }])
const out = formatColor(next, { target: 'rgba', includeAlpha: true })
```

### React
```tsx
import { ColorPicker } from '@pickolor/react'
import { useState } from 'react'
import '@pickolor/styles'

export function App() {
  const [value, setValue] = useState('#ff8800')

  return (
    <ColorPicker
      value={value}
      onChange={({ value: next }) => setValue(next)}
      includeAlpha
      target="hex"
    />
  )
}
```

### Vue
```vue
<script setup lang="ts">
import { ref } from 'vue';
import { ColorPicker } from '@pickolor/vue';
import '@pickolor/styles';

const value = ref('#ff8800');
</script>

<template>
  <ColorPicker v-model="value" :include-alpha="true" target="hex" />
</template>
```

More examples live in `examples/react/README.md` and `examples/vue/README.md`.

## API Overview
### `@pickolor/core`
| Export | Purpose | Signature |
| --- | --- | --- |
| `parseColor` | Parse user input into a `ColorModel`. | `(input: string) => ColorModel` |
| `formatColor` | Format a `ColorModel` into a string. | `(model: ColorModel, request: FormatRequest) => string` |
| `transformColor` | Apply transformations to a model. | `(model: ColorModel, steps: Transformation[]) => ColorModel` |
| `registerPlugin` | Extend parse/format/transform behavior. | `(plugin: Plugin) => void` |

Key types: `ColorModel`, `FormatRequest`, `Transformation`, `ColorError`.

### `@pickolor/react`
Primary export: `ColorPicker`.

| Prop | Purpose |
| --- | --- |
| `value` / `modelValue` / `defaultValue` | Controlled/uncontrolled input value. |
| `target` / `precision` / `includeAlpha` | Output format control. |
| `popoverProps` | Popover positioning and behavior. |
| `onChange` / `onError` | Change and validation callbacks. |

### `@pickolor/vue`
Primary export: `ColorPicker`.

| Prop | Purpose |
| --- | --- |
| `modelValue` / `value` / `defaultValue` | Controlled/uncontrolled input value. |
| `target` / `precision` / `includeAlpha` | Output format control. |
| `popoverProps` | Popover positioning and behavior. |

Emits: `update:modelValue`, `change`, `error`.

### `@pickolor/styles`
Import once to get base styles and CSS variables:
```ts
import '@pickolor/styles'
```

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

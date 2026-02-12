# @pickolor/core

Headless color parsing, formatting, and transform primitives for Pickolor.

## Install
```bash
pnpm add @pickolor/core
```

## Usage
```ts
import { formatColor, parseColor, transformColor } from '@pickolor/core'

const model = parseColor('#ff8800')
const next = transformColor(model, [{ type: 'lighten', value: 0.1 }])
const out = formatColor(next, { target: 'rgba', includeAlpha: true })
```

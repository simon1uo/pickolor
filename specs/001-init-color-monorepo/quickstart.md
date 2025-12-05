# Quickstart - Pickolor 跨框架色彩工具库 MVP

## 前置条件
- Node.js >= 18
- pnpm >= 8

## 安装
```bash
pnpm add @pickolor/core @pickolor/react @pickolor/vue @pickolor/styles
```

## 核心用法（纯函数）
```ts
import { parseColor, formatColor, transformColor } from '@pickolor/core';

const model = parseColor('#ff8800');
const next = transformColor(model, [
  { type: 'lighten', value: 0.1 },
  { type: 'alpha', value: -0.2 },
]);
const out = formatColor(next, { target: 'oklch', precision: 4, includeAlpha: true });

// 结构化错误（code/type/field/message >= 15 chars）
try {
  parseColor('bad-color');
} catch (err) {
  console.error(err);
}
```

## React 壳层示例
```tsx
import { ColorPicker } from '@pickolor/react';
// 可选样式
import '@pickolor/styles/dist/styles.css';

<ColorPicker
  value="#ff8800" // 受控输入，可为任何核心可解析的字符串
  onChange={(model) => {
    const rgba = formatColor(model, { target: 'rgba', includeAlpha: true });
    console.log(rgba);
  }}
/>
```

## Vue 壳层示例
```vue
<script setup lang="ts">
import { ColorPicker } from '@pickolor/vue';
// 可选样式
import '@pickolor/styles/dist/styles.css';

const color = ref('#ff8800');
const onChange = (model) => {
  const next = formatColor(model, { target: 'hex' });
  color.value = next;
};
</script>

<template>
  <!-- v-model 支持：modelValue + update:modelValue -->
  <ColorPicker v-model="color" @change="onChange" />
</template>
```

## 构建与测试
```bash
pnpm install
pnpm build          # tsup 打包各包
pnpm test           # vitest 单测（含壳层测试）
pnpm dev:react      # 启动 React 示例（基于 Vite）
pnpm dev:vue        # 启动 Vue 示例（基于 Vite）
```

## 约束提醒
- 核心包 gzip ≤30KB，运行时依赖 ≤2；React/Vue 壳层各自 gzip ≤25KB，除框架外最多 1 个额外运行时依赖。
- 发布 ESM+CJS 入口并生成类型声明，确保 tree-shaking（sideEffects 标记）。
- React ≥18.2、Vue ≥3.3，支持常规 Vite SSR；Node >=18。
- 遵循 SemVer：破坏性变更仅主版本，至少提前 2 周公告并提供迁移指南。

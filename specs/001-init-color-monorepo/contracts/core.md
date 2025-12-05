# Contracts - Core (TypeScript signatures)

> 说明：以下为核心包的预期接口约定，使用 TypeScript 伪代码描述，供实现与测试对齐；实际实现需符合 Non-Functional Constraints 中的体积与依赖要求。

## Types
```ts
export type ColorSpace = 'hex' | 'rgb' | 'hsl' | 'oklch' | 'hwb' | 'lab';

export type ColorModel = {
  space: ColorSpace;
  values: any; // 详见 data-model.md 中各空间字段约束
  alpha: number; // 0-1, default 1
  source: string; // original input marker
};

export type FormatTarget = 'hex' | 'rgba' | 'rgb' | 'hsla' | 'hsl' | 'oklch';

export type FormatRequest = {
  target: FormatTarget;
  precision?: number; // default 4, 0-6 allowed
  includeAlpha?: boolean;
};

export type TransformationType =
  | 'lighten'
  | 'darken'
  | 'saturate'
  | 'desaturate'
  | 'hueShift'
  | 'alpha';

export type Transformation = {
  type: TransformationType;
  value: number; // constrained by type; see data-model.md
};
```

## Core APIs
```ts
/** Parse input string into ColorModel with validation and normalized precision. */
export function parseColor(input: string): ColorModel;

/** Format a ColorModel into requested string representation. */
export function formatColor(model: ColorModel, request: FormatRequest): string;

/** Apply a sequence of transformations and return updated ColorModel. */
export function transformColor(
  model: ColorModel,
  steps: Transformation[],
): ColorModel;

/** Register plugin for parse/format/transform extensions. */
export type Plugin = {
  name: string; // unique
  supports: Partial<Record<FormatTarget | ColorSpace, boolean>>;
  parse?: (input: string) => ColorModel | null;
  format?: (model: ColorModel, request: FormatRequest) => string | null;
  transform?: (model: ColorModel, step: Transformation) => ColorModel | null;
};

export function registerPlugin(plugin: Plugin): void;
```

## Error Contract
```ts
export type ColorError = {
  code: string; // machine-readable
  type: 'parse' | 'format' | 'transform' | 'plugin';
  field?: string; // component/channel if applicable
  message: string; // human-readable, >= 15 chars
};
```

- 所有 API 需在非法输入时抛出或返回结构化错误（携带 code/type/field/message），不得静默失败。
- 精度与范围校验规则与 data-model.md 对齐；分量裁剪或报错策略需在实现中保持一致性并在文档明确。

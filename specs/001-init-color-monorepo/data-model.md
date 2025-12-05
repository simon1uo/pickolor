# Data Model - Pickolor 跨框架色彩工具库 MVP

## Entities

### ColorModel
- **Fields**:
  - `space` (enum): `hex | rgb | hsl | oklch | hwb | lab`（可扩展），标记当前规范化色彩空间。
  - `values` (object/tuple by space):
    - `hex`: string（不含 `#`，长度 3/4/6/8）。
    - `rgb`: `{ r: number, g: number, b: number }`，范围 0-255。
    - `hsl`: `{ h: number, s: number, l: number }`，h: 0-360，s/l: 0-1。
    - `oklch`: `{ l: number, c: number, h: number }`，l: 0-1，c: ≥0（可定义上限校验），h: 0-360。
  - `alpha` (number): 0-1，默认 1。
  - `source` (string): 原始输入格式标记（如 `#RRGGBB`、`rgb()`, `oklch()`）。
- **Validation Rules**: 分量超界需裁剪或返回错误；精度默认保留 4 位小数；缺省 alpha 补 1。
- **Relationships**: 由解析器生成，供格式化器/变换器消费；贯穿 React/Vue 壳层数据流。

### FormatRequest
- **Fields**:
  - `target` (enum): `hex | rgb | rgba | hsl | hsla | oklch` 等输出格式。
  - `precision` (number | undefined): 默认 4；控制数值保留位数。
  - `includeAlpha` (boolean | undefined): 控制输出是否携带 alpha（若目标格式支持）。
- **Validation Rules**: 不支持的目标格式需返回错误；precision 限制 0-6。

### Transformation
- **Fields**:
  - `type` (enum): `lighten | darken | saturate | desaturate | hueShift | alpha` 等。
  - `value` (number): 按类型的范围约束，例如亮度/饱和度调整 -1~1，色相偏移 -360~360，alpha 调整 -1~1。
- **Validation Rules**: 超界报错或裁剪；按声明顺序应用。

### TransformationStack
- **Fields**: `steps: Transformation[]`；可包含历史或可撤销标记。
- **Validation Rules**: 顺序执行；失败的步骤需返回错误并不中断已生效步骤状态（或回滚，依据实现策略在设计阶段确定）。

## State & Lifecycle
- 解析：输入字符串 → 校验 → 生成 ColorModel。
- 变换：基于当前 ColorModel 顺序应用 TransformationStack → 新的 ColorModel。
- 格式化：ColorModel → 按 FormatRequest 输出字符串/结构化结果。
- 适配层：React/Vue 壳层仅消费/触发上述流程，不修改核心模型结构。

## Data Volume / Scale
- 主要在客户端轻量使用，单次操作作用于单个 ColorModel；无需持久化或批量存储。

# Data Model — 002-colorpicker-unify

## Entities

- **ColorModel**
  - Fields: `hue` (0-360), `saturation` (0-100), `value`/`lightness` (0-100 依据平面模式), `alpha` (0-100 或 0-1 统一内部), `format` (当前展示格式枚举)。
  - Rules: 单一来源；任意视图更新需回写此模型；输入非法时保持上次有效值并触发 error。

- **FormatView**
  - Fields: `type` (HEX | RGBA | HSLA | OKLCH 等扩展位), `text` (当前格式化字符串)。
  - Rules: 切换时以 ColorModel 重格式化；输入解析成功才提交；失败触发 error。

- **PresetColor**
  - Fields: `id`/key, `label` (可选), `value` (与 ColorModel 兼容的颜色值)。
  - Rules: 外部传入；列表为空则不渲染预设区。

- **HistoryEntry**
  - Fields: `value` (颜色值), `timestamp`, `formatSnapshot` (记录当时格式类型)。
  - Rules: 内存维护，默认上限 10，按值去重（最新覆盖旧项）；可由外部完全接管。

## Relationships & State

- ColorModel 是板、滑条、输入、预设/历史选择的单一来源；FormatView 依附 ColorModel 展示与解析。
- 历史列表在每次确认/应用时追加；预设选择绕过历史规则但触发回调。
- 清除操作将 ColorModel 置为空态（或默认值），并触发同步回调。

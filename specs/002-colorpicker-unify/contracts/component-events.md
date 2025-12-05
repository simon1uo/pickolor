# Contracts — Component Interactions (002-colorpicker-unify)

> 本组件为前端库，无后端 API。本合同描述事件/回调负载，保持 React/Vue 语义对齐。

## Inputs

- **value / modelValue**: 受控模式下的颜色值（统一 ColorModel 可解析的字符串/对象）。
- **defaultValue**: 非受控初始值。
- **formatRequest**: 指定当前显示格式（HEX/RGBA/HSLA/OKLCH...）；未传则内部管理。
- **presets**: 预设颜色列表。
- **history** (可选外部驱动): 历史列表（若提供则内部不持有）。

## Events

- **onChange / change**
  - Payload: `{ model: ColorModel, formatted: string, input?: string }`
  - Semantics: 每次板/滑条/输入/预设/历史/清除确认后的同步通知。

- **onError / error**
  - Payload: `Error` 对象（含可读 message 和问题字段）。
  - Semantics: 输入解析或同步失败时触发，不强制 UI 呈现。

- **update:modelValue** (Vue)
  - Payload: 与 onChange 相同的颜色值（遵循 v-model 语义）。

## Behaviors

- 格式切换：使用当前 ColorModel 重格式化后更新文本视图；错误不覆盖现有有效值。
- 复制：复制当前 formatted 字符串，失败需反馈。
- 清除：重置 ColorModel 到空态/默认，并触发 onChange。
- 键盘导航：Tab/Shift+Tab 在可聚焦控件间移动；箭头键微调板/滑条；Enter/Space 触发按钮型控件。

## A11y 焦点与 aria 清单（唯一落点）

- 可聚焦元素（顺序建议）：触发器输入 → 清除按钮（可选） → 复制按钮（可选） → 色板 → 色相滑条 → 透明度滑条 → 预设列表项（逐个） → 历史列表项（逐个）。  
- ARIA/属性约定：
  - 输入/触发器：`role="combobox"` 或默认输入，`aria-expanded` 反映 Popover 状态，`aria-controls` 指向弹层。  
  - 色板：`role="application"` 或 `role="slider"`（若使用二维可调），需 `aria-label`/`aria-valuetext` 表达当前颜色。  
  - 滑条：`role="slider"`，`aria-valuemin="0"`、`aria-valuemax="100"`、`aria-valuenow` 与 `aria-label`。  
  - 预设/历史/复制/清除按钮：`role="button"`，可用 Enter/Space 触发；复制失败需可感知反馈（例如 `aria-live="polite"` 文本）。  
  - Popover 容器：`role="dialog"`，`aria-modal="false"`（非阻塞），并用 `aria-label`/`aria-labelledby` 关联触发器。  
  - 错误状态：输入解析失败时可选 `aria-invalid="true"`，并在同层提供 `aria-live="polite"` 的文本区域。

# Feature Specification: 跨框架 ColorPicker 统一体验

**Feature Branch**: `002-colorpicker-unify`  
**Created**: 2025-12-05  
**Status**: Draft  
**Input**: User description: "结合当前项目的实现情况，进行以下共同实现完善vue和react的ColorPicker组件的需求分析： 目标形态与范围 - 触发器：文本输入框 + 内嵌预览 swatch；可选清除按钮；受控/非受控均可。 - 弹出面板：Popover 容器负责定位、层级、开合控制、点击外部关闭；内含以下区域： - 2D 颜色选择板（S/V 或 L/C 等平面）+ Thumb 指示器。 - 色相滑条；透明度滑条；可选色环/光谱。 - 数值输入区：格式切换（HEX / RGB(A) / HSL(A) / 未来扩展 OKLCH 等），输入框联动。 - Copy 按钮（可选）。 - 预设色板 + 历史列表。 - 同步：任意输入/拖拽/滑动会同步更新所有视图与格式化输出。 跨框架 API 统一度 - React：value, defaultValue, onChange(model, formatted, input), onError(error), 其他控制/样式 props。 - Vue：modelValue + update:modelValue，change(model, formatted, input)，error，保持 Vue 特有 v-model 语义，但事件负载与 React 对齐 （ColorModel + formatted + 原始输入）。 - 统一 ColorModel 穿透到子组件/子空间（板、滑条、输入域等共享同一来源状态）。 状态与模式 - 受控 + 非受控双模式：value / modelValue 受控，defaultValue/内部 state 非受控。 - formatRequest 或当前格式状态需可控（外部或内部管理）。 - 错误处理沿用现有 onError/error，仅抛错误对象；UI 可选择展示错误态但不强制。 样式与主题 - 复用 packages/styles 的 CSS 变量/类名体系，扩展浅/深主题变量。 - 允许外部通过 className/slots/自定义 render 覆盖（不破坏默认样式）。 - 保持 0 运行时依赖（除 colord），支持 tree-shaking，体积约束不放宽。 交互与无障碍 - 基本 A11y：键盘导航（Tab/箭头调节滑条与板）、ARIA 角色/label，聚焦指示。 - 触控与鼠标拖拽都要支持；点击外部关闭弹层。 - Swatch/清除按钮/复制按钮可聚焦与键盘触发。 输出格式与转换 - 多路同步：滑条/板/输入框/预设/历史全联动，保持当前格式视图与值一致。 - 格式切换：切换时应使用 ColorModel 重新格式化当前值。 - 暴露 US2 变换链作为 hook/工具（如变亮/降饱和按钮）可组合到 UI。 历史与预设 - 预设颜色列表（可配置）；历史记录（可选，内存维护或外部驱动）。 示例与测试期望（隐含） - React/Vue 示例需覆盖受控/非受控、格式切换、板+滑条交互、预设/历史、复制。 - 测试覆盖：输入/拖拽同步，v-model/受控回调负载一致性，格式切换，非受控默认值，A11y 基础键盘路径。"

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - 通过触发器选择并预览颜色 (Priority: P1)

设计师或开发者在表单中点击文本输入触发器，打开弹出面板，通过色板/色相/透明度控制选中目标颜色，实时预览和输入框同步显示当前值。

**Why this priority**: 这是组件的核心路径，决定用户能否完成颜色挑选与确认。

**Independent Test**: 仅交付触发器 + 弹层 + 色板/滑条同步，用户即可完成颜色选择与确认，形成可演示的独立价值。

**Acceptance Scenarios**:

1. **Given** 触发器有初始值或为空，**When** 用户点击触发器打开弹层并在色板拖动，**Then** 预览、文本输入和滑条指示同步更新且弹层保持开启。
2. **Given** 弹层打开，**When** 用户点击弹层外部或按下 Esc，**Then** 弹层关闭且已选颜色保留。

---

### User Story 2 - 切换格式与复制输出 (Priority: P2)

用户在弹层内切换显示格式（如 HEX、RGBA、HSLA），输入或调整后希望复制符合当前格式的值供他处粘贴。

**Why this priority**: 确保跨团队和工具的值格式兼容，减少人工转写错误。

**Independent Test**: 仅交付格式切换与复制，仍可独立为现有颜色选择流程提供价值。

**Acceptance Scenarios**:

1. **Given** 当前展示某格式，**When** 用户切换到另一格式，**Then** 文本输入与预览使用同一颜色重新格式化且数值有效。
2. **Given** 当前颜色已定，**When** 用户点击复制，**Then** 剪贴板获得与当前格式一致的字符串，且若失败提供可感知反馈。

---

### User Story 3 - 使用预设与历史快捷选色 (Priority: P3)

用户在设计流程中希望快速回到常用预设或近期使用的颜色，并可清空当前值。

**Why this priority**: 提升频繁操作效率，减少重复选择时间。

**Independent Test**: 仅交付预设/历史与清除按钮，也能独立提升效率且易于演示。

**Acceptance Scenarios**:

1. **Given** 已配置预设列表，**When** 用户点击某预设，**Then** 当前颜色、预览、输入框与滑条同步跳转到该值。
2. **Given** 组件处于非空状态，**When** 用户点击清除按钮，**Then** 颜色值清空、预览为空态、外部回调收到清除后的状态。

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- 输入非法字符串或格式不完整时，如何校验、提示并保持既有有效值不被破坏。  
- 拖拽出界（色板/滑条）时的裁剪与回弹；触控与鼠标混合操作的优先级。  
- 透明度为 0 或纯黑/纯白时，预览可见性与对比度处理。  
- 弹层在快速开合或外部点击时，当前编辑值与已提交值的一致性。  
- 历史列表容量上限、去重策略及跨会话是否保留的行为。

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: 组件提供文本输入触发器，含内嵌颜色预览与可选清除控制，可在受控与非受控模式下运行。  
- **FR-002**: 弹出面板提供定位、层级与开合控制，支持外部点击或键盘关闭，关闭后保留已选状态。  
- **FR-003**: 色板与色相/透明度控制需同步同一颜色模型，拖拽或键盘微调时各视图即时一致。  
- **FR-004**: 数值输入区支持在 HEX / RGBA / HSLA 等格式间切换，切换时基于当前颜色重新格式化并校验输入。  
- **FR-005**: 提供复制当前颜色值的操作，复制内容与当前展示格式一致，失败时反馈可感知。  
- **FR-006**: 支持可配置预设列表与可选历史记录，点击时直接应用并触发同步更新；历史数量与去重策略可由产品定义。  
- **FR-007**: React 与 Vue 接口事件负载保持一致（颜色模型、格式化字符串、原始输入），分别符合各自受控/v-model 语义。  
- **FR-008**: 提供 format 状态的内部管理与外部控制入口，外部传入时内部视图需尊重外部指令。  
- **FR-009**: 组件暴露错误回调，用于输入或同步失败时传递错误对象；UI 是否显示错误由集成方决定。  
- **FR-010**: 键盘可访问性覆盖触发器、清除、复制、色板与滑条，箭头键可微调，Tab/Shift+Tab 可在可聚焦元素间移动，并有聚焦指示。  
- **FR-011**: 同步输出需支持当前值的再利用，例如与后续亮度/饱和度调整工具组合使用，不改变现有同步行为。

## Clarifications

### Session 2025-12-05

- Q: 历史记录写入时机？→ A: 仅在确认/提交当前颜色时写入历史（避免拖拽噪音，保留最终有效值）。
- Q: 色板默认平面模式？→ A: 默认 S/V 平面（Hue 固定），与 colord 适配与常见取色器一致；若未来支持 L/C 再扩展。

### Key Entities *(include if feature involves data)*

- **颜色模型 (ColorModel)**: 描述当前颜色的标准化表示（含色相、明度/饱和度或亮度、透明度），作为所有视图的单一来源。  
- **格式视图 (FormatView)**: 记录当前选择的格式类型及其文本表示，用于切换与校验。  
- **预设项 (PresetColor)**: 预定义的颜色集合，含展示名称与颜色值。  
- **历史记录 (HistoryEntry)**: 按时间顺序存储最近使用的颜色值及格式。

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 80% 以上的用户可在 3 次以内操作完成颜色选择并确认输出。  
- **SC-002**: 格式切换后显示值与内部颜色一致率 100%，无格式丢失或错误。  
- **SC-003**: 键盘操作完成主要颜色调整（打开、选色、确认）成功率 ≥90%。  
- **SC-004**: 常用颜色路径（预设或历史）能将重复选色时间较基线降低至少 30%。

## Clarifications

### Session 2025-12-05

- Q: 历史记录写入时机？→ A: 仅在确认/提交当前颜色时写入历史（避免拖拽噪音，保留最终有效值）。

# Tasks — 跨框架 ColorPicker 统一体验

## Phase 1 — Setup

- [x] T001 初始化任务清单文件并对齐计划（本文件）  
- [x] T002 确认分支 `002-colorpicker-unify` 已检出，阅读 `spec.md`、`plan.md`、`research.md`、`data-model.md`、`contracts/component-events.md`  
- [x] T003 确认 pnpm 工作区可用，运行 `pnpm install`（如需）并验证无新增锁定变更  
- [x] T004 校验现有 scripts：`pnpm test` / `pnpm run lint` 在当前环境可运行（仅验证命令存在，暂不执行耗时测试）

## Phase 2 — Foundational (跨故事共用前置)

- [x] T005 定义 ColorModel/FormatView 类型与解析/格式化辅助（含 alpha、格式枚举、解析/格式化往返校验），若已有实现则补齐缺口；位置 `packages/core/src`  
- [x] T006 梳理样式变量与类名挂载点，确保默认 CSS 可选且不影响功能，位置 `packages/styles`  
- [x] T007 约定键盘/触控交互的可聚焦元素与 aria 属性清单，统一写入 `specs/002-colorpicker-unify/contracts/component-events.md`（唯一落点）  
- [x] T008 Constitution 提示：审核 core 仅含逻辑/模型，不引入 UI 依赖；壳层仅做 React/Vue 适配，并在评审 checklist 体现

## Phase 3 — User Story 1 (P1) 触发器 + 弹层选色与同步

- [ ] T009 [US1] 实现触发器输入与内嵌预览（受控/非受控）于 `packages/react` 与 `packages/vue` 对应组件  
- [ ] T010 [P] [US1] 实现 Popover 开合与外部点击/Esc 关闭，保持选中状态，React/Vue 壳层各一处  
- [ ] T011 [US1] 实现色板 + 色相/透明度滑条联动 ColorModel，同步到输入/预览，React/Vue 壳层  
- [ ] T012 [P] [US1] 键盘支持：Tab/Shift+Tab/箭头/Enter/Space 覆盖触发器、板、滑条，React/Vue 壳层  
- [ ] T013 [US1] 示例与最小测试：受控/非受控初始值，拖拽同步，外部点击/Esc 关闭后保持值；文件：`packages/react/**/*tests*`, `packages/vue/**/*tests*`

## Phase 4 — User Story 2 (P2) 格式切换与复制

- [ ] T014 [US2] 增加格式切换视图与输入校验，格式受控/非受控均支持，基于 ColorModel 重格式化；React/Vue 壳层  
- [ ] T015 [P] [US2] 实现复制操作（当前格式字符串），失败反馈路径，React/Vue 壳层  
- [ ] T016 [US2] onError 触发与处理：非法输入/格式解析失败触发回调（React/Vue 壳层），含组件测试；文件：`packages/react/**/*tests*`, `packages/vue/**/*tests*`  
- [ ] T017 [P] [US2] A11y - 复制路径：复制按钮可聚焦与键盘触发（Enter/Space），Tab/Shift+Tab 顺序，失败反馈可感知；文件：`packages/react/**/*tests*`, `packages/vue/**/*tests*`  
- [ ] T018 [US2] 示例/测试：格式切换成功与失败（触发 onError），复制成功与失败反馈；文件：`packages/react/**/*tests*`, `packages/vue/**/*tests*`

## Phase 5 — User Story 3 (P3) 预设与历史、清除

- [ ] T019 [US3] 预设列表应用当前值，空列表隐藏区域，React/Vue 壳层  
- [ ] T020 [US3] 历史列表：内存去重、默认上限 10，确认/提交时写入，React/Vue 壳层（支持外部驱动透传）  
- [ ] T021 [P] [US3] 清除按钮：重置值与预览，触发回调，React/Vue 壳层  
- [ ] T022 [P] [US3] A11y - 预设/历史/清除：可聚焦与键盘触发（Enter/Space），Tab 顺序包含预设/历史/清除按钮；文件：`packages/react/**/*tests*`, `packages/vue/**/*tests*`  
- [ ] T023 [US3] 同步输出复用验证：示例或测试中将当前输出作为后续变换链输入（如亮度+10%或降饱和），确保负载稳定；文件：`packages/react/**/*tests*` 或示例，`packages/vue/**/*tests*` 或示例  
- [ ] T024 [US3] 示例/测试：预设点击同步、历史写入时机（仅确认/提交时）、清除回调与预览空态、A11y 键盘路径；文件：`packages/react/**/*tests*`, `packages/vue/**/*tests*`

## Phase 6 — Polish & Cross-Cutting

- [ ] T025 对照 Constitution 复查：core 不引入 UI 依赖，单一 ColorModel，同步语义一致  
- [ ] T026 React/Vue 负载一致性校验：对比 onChange/change/update:modelValue 载荷（ColorModel + formatted + input），确保一致；文件：`packages/react/**/*tests*`, `packages/vue/**/*tests*` 或对比脚本  
- [ ] T027 体积与依赖核对：执行构建并记录 gzip 体积（核心 ≤30KB，壳层 ≤25KB），确认无额外运行时依赖除 colord  
- [ ] T028 A11y 覆盖核验：列出并验证键盘/触控用例清单（触发器、板、滑条、复制、预设、历史、清除），确保全部可聚焦与可触发  
- [ ] T029 文档与示例补全：quickstart/README 片段更新，列出 React/Vue 受控/非受控与格式切换示例  
- [ ] T031 成功标准验证 SC-001/SC-003：设计并执行交互用例，记录完成颜色选择步骤数（≤3 次达成率）与键盘路径成功率；文件：测试/手册说明  
- [ ] T032 成功标准验证 SC-004：对比预设/历史路径与基线手动选色时间，确认降低 ≥30%；记录测量方法与结果  
- [ ] T030 运行 `npm test && npm run lint`（或 pnpm 等效）并记录结果

## Dependencies / Order

- US1 → US2 → US3（基础选色能力先行，再格式切换与复制，最后预设/历史/清除）  
- Foundational（Phase 2）必须先于所有故事完成  
- 示例/测试可与实现并行标记 [P] 的任务并行执行

## Parallel Execution Examples

- 在 US1 中，Popover 行为 (T009) 与键盘支持 (T011) 可并行。  
 - 在 US3 中，清除按钮 (T021) 可与预设/历史实现 (T019/T020) 并行。

## Implementation Strategy

- 先完成 Phase 2 基础，然后按优先级交付 US1→US2→US3，每个阶段保持可独立演示与测试。  
- 每个故事完成后更新示例与最小测试，确保回调负载与格式一致性。

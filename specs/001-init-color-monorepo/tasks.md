# Tasks: Pickolor 跨框架色彩工具库 MVP

**Input**: Design documents from `/specs/001-init-color-monorepo/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: 各故事包含最小必要的单测/示例验证，用于独立验收。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 初始化 pnpm workspace 与基础配置

- [X] T001 初始化 workspace 根配置与包管理：创建 `package.json`、`pnpm-workspace.yaml`、`README.md`（描述 packages/core|react|vue|styles）
- [X] T002 [P] 创建共享配置目录 `configs/`：生成 `tsconfig.base.json`、`tsconfig.build.json`、`.editorconfig`
- [X] T003 [P] 配置 ESLint 基线使用 `@antfu/eslint-config`：创建 `configs/eslint.config.js`，移除/不引入 Prettier，提供 `pnpm lint` 脚本
- [X] T004 [P] 初始化 gitignore 与基本脚本：更新 `.gitignore`，在根 `package.json` 添加 `dev:react`、`dev:vue`、`build`、`test` 脚本占位

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 核心跨包基础设施，完成前不得进入故事实现

- [X] T005 配置核心构建管线：为 `packages/core` 添加 `tsconfig.json`、`tsup.config.ts`，输出 ESM+CJS+d.ts，标记 sideEffects
- [X] T006 配置 React 壳层构建：`packages/react/tsconfig.json`、`tsup.config.ts`，外部化 React，输出 ESM+CJS+d.ts
- [X] T007 配置 Vue 壳层构建：`packages/vue/tsconfig.json`、`tsup.config.ts`，外部化 Vue，输出 ESM+CJS+d.ts
- [X] T008 配置样式包构建：`packages/styles/package.json`、`tsconfig.json`，构建到 `dist/styles.css`，确保可选引入
- [X] T009 [P] 共享类型与路径映射：在根 `tsconfig.json` 引用 `configs/tsconfig.base.json`，设置 `paths` 指向各包 src
- [X] T010 [P] 设置 Vitest 基线：`vitest.config.ts`（含 React/Vue 适配器配置）、`packages/core/tests/setup.ts`
- [X] T011 [P] 设置 Vite 示例基线：创建 `examples/react/vite.config.ts` 与 `examples/vue/vite.config.ts` 占位，确保可跑 dev

**Checkpoint**: Foundational 完成后方可开始各用户故事

---

## Phase 3: User Story 1 - 统一解析与标准输出 (Priority: P1) 🎯 MVP

**Goal**: 支持多格式输入解析为统一模型并输出指定格式字符串/结构化结果。
**Independent Test**: 通过核心纯函数对 HEX/RGB(A)/HSL(A)/OKLCH 解析与格式化的单测全通过。

### Tests for User Story 1
- [X] T012 [P] [US1] 编写解析/格式化单测（合法/非法/越界/精度舍入）：`packages/core/tests/parse-format.spec.ts`

### Implementation for User Story 1
- [X] T013 [US1] 定义核心类型与错误契约：`packages/core/src/types.ts`、`packages/core/src/errors.ts`
- [X] T014 [US1] 实现解析管线（委托 colord，含适配层与错误映射）：`packages/core/src/parse.ts`
- [X] T015 [US1] 实现格式化管线（统一模型→目标格式，精度/alpha 处理）：`packages/core/src/format.ts`
- [X] T016 [US1] 实现插件注册与调用钩子：`packages/core/src/plugins.ts`
- [X] T017 [US1] 汇总核心入口与树摇友好导出：`packages/core/src/index.ts`

**Checkpoint**: 核心解析/格式化能力可独立验证，满足 FR-001/FR-002/FR-009/FR-010

---

## Phase 4: User Story 2 - Headless 状态与变换 (Priority: P2)

**Goal**: 提供可组合的颜色变换与状态管理纯函数，支持错误回退。
**Independent Test**: 变换链单测覆盖顺序性、超界处理与输出一致性。

### Tests for User Story 2
- [ ] T018 [P] [US2] 编写变换链单测（亮度/饱和度/色相/alpha、超界/非法输入、顺序与舍入）：`packages/core/tests/transform.spec.ts`

### Implementation for User Story 2
- [ ] T019 [US2] 定义 Transformation 约束与校验：`packages/core/src/transform/types.ts`
- [ ] T020 [US2] 实现变换引擎（链式应用 + 精度/回退策略）：`packages/core/src/transform/engine.ts`
- [ ] T021 [US2] 暴露变换 API 与组合工具：`packages/core/src/transform/index.ts`
- [ ] T022 [US2] 更新核心入口导出 headless 变换能力：`packages/core/src/index.ts`

**Checkpoint**: 变换能力可独立验证，满足 FR-003/FR-004/FR-005

---

## Phase 5: User Story 3 - React/Vue Shell 与可选样式 (Priority: P3)

**Goal**: 提供 React/Vue 壳层最小绑定与可选样式，消费核心模型与变换能力。
**Independent Test**: React/Vue 示例可在 5 分钟内完成颜色输入、变换与输出验证，样式可开关。

### Tests for User Story 3
- [ ] T023 [P] [US3] React 壳层交互单测（受控输入/变换回调）：`packages/react/tests/color-picker.spec.tsx`
- [ ] T024 [P] [US3] Vue 壳层交互单测（受控输入/变换回调，含 v-model 双向同步）：`packages/vue/tests/color-picker.spec.ts`

### Implementation for User Story 3
- [ ] T025 [US3] React 壳层组件与 hooks（消费核心 API，最小绑定）：`packages/react/src/ColorPicker.tsx`
- [ ] T026 [US3] Vue 壳层组件与 composables（支持 v-model：`modelValue` + `update:modelValue`，事件负载为 ColorModel）：`packages/vue/src/ColorPicker.vue`、`packages/vue/src/useColor.ts`
- [ ] T027 [US3] 样式包基础样式与 CSS 变量：`packages/styles/src/styles.css`
- [ ] T028 [US3] React 示例接入核心与样式（可选）：`examples/react/src/App.tsx`
- [ ] T029 [US3] Vue 示例接入核心与样式（可选）：`examples/vue/src/App.vue`
- [ ] T030 [US3] 更新壳层入口导出：`packages/react/src/index.ts`、`packages/vue/src/index.ts`

**Checkpoint**: 壳层与示例可独立验证，满足 FR-006/FR-007/FR-008

---

## Phase N: Polish & Cross-Cutting Concerns

- [ ] T031 验证打包体积与依赖约束（核心 gzip ≤30KB 依赖≤2；壳层 gzip ≤25KB 额外依赖≤1），超标视为失败并记录测量数据：`specs/001-init-color-monorepo/research.md`
- [ ] T032 校验 ESM+CJS+d.ts 输出与 sideEffects 标记，更新 `packages/*/package.json`
- [ ] T033 [P] 文档与快速开始校对：更新 `specs/001-init-color-monorepo/quickstart.md`、根 `README.md`
- [ ] T034 [P] 示例自测脚本：在 `examples/react`、`examples/vue` 添加 `README` 与运行脚本说明
- [ ] T035 收尾检查：运行 `pnpm lint && pnpm test && pnpm build`，记录结果
- [ ] T036 确认跨框架兼容配置：设置 React/Vue peerDependencies 下限、Node engines ≥18、tsup ESM+CJS 双入口，更新 `packages/*/package.json`、`packages/*/tsup.config.ts`
- [ ] T037 运行 Vite SSR 冒烟测试（React/Vue 示例各一次，Node ≥18），记录结果：`examples/react`、`examples/vue`
- [ ] T038 编写发布与版本策略文档（SemVer、破坏性变更仅主版本、提前 2 周公告、迁移指南流程）：`docs/release.md`
- [ ] T039 添加发布校验脚本（校验版本号与 changelog/migration 模板存在）：`scripts/release/check-version.ts`
- [ ] T040 提供公告/迁移指南模板文件：`docs/templates/changelog.md`、`docs/templates/migration.md`
- [ ] T041 [US1] 断言解析/格式化结构化错误（错误码/类型/字段/描述长度≥15）：`packages/core/tests/parse-format.spec.ts`
- [ ] T042 [US2] 断言变换非法输入结构化错误：`packages/core/tests/transform.spec.ts`
- [ ] T043 [US3] Vue v-model 事件负载断言（modelValue 双向同步，update:modelValue 传递 ColorModel）：`packages/vue/tests/color-picker.spec.ts`
- [ ] T044 [US3] Vue 示例验证 v-model 交互（外部更新与组件内部更新均同步）：`examples/vue/src/App.vue`
- [ ] T045 运行体积测量脚本（如 `scripts/report-bundle-size.ts`），确认核心/壳层体积与依赖未超标，超标即失败并将数据写入 `specs/001-init-color-monorepo/research.md`

---

## Dependencies & Execution Order

- Phase 1 → Phase 2 → US1 (P1) → US2 (P2) → US3 (P3) → Polish
- 用户故事可在 Phase 2 完成后并行启动；建议先完成 P1 作为 MVP。

## Parallel Opportunities

- 标记 [P] 的配置、测试可并行执行（不同目录无依赖冲突）。
- US1/US2/US3 可由不同成员并行推进，但需在合并前完成各自单测与示例验证。

## Implementation Strategy

- MVP 优先：完成 US1 后即可提供核心解析/格式化能力演示。
- 逐步扩展：在保持核心稳定的前提下交付 US2 变换、再交付 US3 壳层与样式。

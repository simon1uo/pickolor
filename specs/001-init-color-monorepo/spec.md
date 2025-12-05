# Feature Specification: Pickolor 跨框架色彩工具库 MVP

**Feature Branch**: `001-init-color-monorepo`  
**Created**: 2025-12-04  
**Status**: Draft  
**Input**: User description: "在当前文件夹下初始化一个轻量级、跨框架（VUE3 + React18）的 pnpm workspace monorepo + vite + Typescript 工具库项目的 MVP 版本，目前首要需求如下： 项目名称为 pickolor ；语言 & 基础：TypeScript + ESM 优先。系统应提供一个核心 package，用于定义统一的 Color 数据模型，以及一组小而稳定的 API，用于解析、格式化、转换和操作颜色；所有底层色彩数学计算需委托给成熟的底层色彩引擎 colord 以轻量级；需要支持多种输入格式（HEX、RGB(A)、HSL(A)，以及可选的现代色彩空间如 OKLCH），并将所有输入规范化为内部统一的颜色表示，再根据调用方需求输出指定格式的颜色。UI实现模式：Headless core + React/Vue Shell；建议分层：@pickolor/core 不依赖 React/Vue， 提供：颜色解析与格式转换封装（基于 colord）；常用 hooks 样式的纯函数；@pickolor/react：使用 React 18（hooks）实现 UI 组件；@pickolor/vue：使用 Vue 3（Composition API + <script setup> 支持）；UI 技术细节：CSS + CSS 变量：不应该强依赖UI库；样式使用 原生 CSS + CSS 变量；使用 BEM 或相对简单的 class 命名；将样式打包为：dist/styles.css：用户按需引入、或支持「无样式 headless 模式」：只提供结构和 data props，让用户完全自定义 UI；构建工具：Vite + tsup：开发体验：Vite；打包构建：建议使用 tsup。"

## Clarifications

### Session 2025-12-04

- Q: 如何量化“轻量级”（包体与依赖约束）？ → A: 核心包 gzip ≤ 30KB，最多 2 个运行时依赖；React/Vue 壳层 gzip ≤ 25KB，除各自框架外可有 1 个额外运行时依赖。
- Q: 如何定义“跨框架最小兼容能力”（React/Vue 版本与运行环境覆盖）？ → A: React ≥18.2、Vue ≥3.3；支持 CSR 与 SSR（含 Vite 常规 SSR 场景）；发布 ESM + CJS 双入口，要求 Node ≥18。
- Q: 如何量化“统一数据模型”的必备字段与精度/范围规范？ → A: 模型包含 space（枚举：hex、rgb、hsl、oklch 等）、values（按空间定义的分量范围/单位）、alpha（0-1，默认 1）、source（原始格式标记）；数值默认保留 4 位小数，分量范围遵循各色彩空间规范。
- Q: 如何约束“稳定 API”的变更规则与发布节奏？ → A: 遵循 SemVer，破坏性变更仅出现在主版本，至少提前 2 周公告并提供迁移指南；次/补丁版本仅做向后兼容调整与修复。
- Q: 如何量化“可扩展/开发者友好”的定制与扩展机制（插件/扩展点、错误信息可读性）？ → A: 支持可注册的解析/格式化/变换插件，需有唯一名称、适用空间声明与校验；错误信息包含错误类型、分量名称、可读描述（≥15 字）和机器可解析错误码；文档需提供扩展示例。
- Q: 代码格式化/审查工具选型与配置约束？ → A: 统一使用 `@antfu/eslint-config`，不引入 Prettier；采用 `eslint.config.js` 进行集中配置，无需 `.eslintignore`。
- Q: Vue 壳层是否必须支持 v-model？ → A: 必须支持 v-model（使用 `modelValue` + `update:modelValue` 事件），双向数据应传递规范化的 ColorModel 并与核心事件保持一致。

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 统一解析与标准输出 (Priority: P1)

作为设计系统或组件库的维护者，我希望库能将多种常见/现代色彩输入（HEX、RGB(A)、HSL(A)、OKLCH 等）解析为统一的数据模型，并按需输出指定格式，以便在不同框架和样式体系中保持一致。

**Why this priority**: 统一解析与输出是后续 UI 壳层和样式分发的前置能力，缺失则无法复用。

**Independent Test**: 仅依赖核心解析/格式化函数，对多格式输入进行转换验证即可独立测试，无需依赖 UI。

**Acceptance Scenarios**:

1. **Given** 提供合法的 HEX、RGB(A)、HSL(A)、OKLCH 字符串，**When** 调用解析并请求标准格式输出，**Then** 返回统一模型与目标格式字符串且与预期值一致。
2. **Given** 同一颜色的不同输入格式，**When** 转换为统一模型后输出为同一目标格式，**Then** 多输入的输出结果一致且色值误差可接受。

---

### User Story 2 - Headless 状态与变换 (Priority: P2)

作为前端开发者，我希望获得无框架绑定的纯函数/状态管理接口，用于调整颜色（如调亮、调暗、透明度、色相偏移），并保持操作可组合、可预测，方便接入自定义 UI。

**Why this priority**: 开发者需要在不引入特定 UI 依赖的情况下完成业务需求，确保库能在不同框架中复用。

**Independent Test**: 通过调用纯函数或 headless 状态管理逻辑，验证变换后的统一模型与输出结果，无需引入 React/Vue。

**Acceptance Scenarios**:

1. **Given** 统一模型与一组变换操作，**When** 顺序应用变换并输出指定格式，**Then** 结果符合预期色彩变化且操作顺序可追踪。
2. **Given** 非法操作参数（如超出范围的数值），**When** 执行变换，**Then** 返回清晰的错误或默认回退且不破坏现有状态。

---

### User Story 3 - React/Vue Shell 与可选样式 (Priority: P3)

作为使用 React18 或 Vue3 的应用开发者，我希望有对应框架的壳层组件/组合式接口，能直接消费核心能力，并可选择默认样式或完全自定义，以便快速落地色彩选择和预览交互。

**Why this priority**: 提供框架壳层加快集成速度，同时保持可插拔样式满足品牌定制。

**Independent Test**: 在各自框架示例中接入壳层接口，验证颜色输入、输出与交互状态同步正确，默认样式可选且可关闭。

**Acceptance Scenarios**:

1. **Given** React 或 Vue 应用，**When** 引入壳层接口并提供颜色输入，**Then** 能获取统一模型、触发变换、输出目标格式，且与核心行为一致。
2. **Given** Vue 使用者通过 v-model（`modelValue` + `update:modelValue`）绑定，**When** 用户交互或外部更新，**Then** 颜色状态双向同步且事件负载为规范化 ColorModel。
3. **Given** 关闭默认样式，仅使用结构和数据，**When** 开发者自定义样式，**Then** 交互与数据流保持正常且不受默认样式影响。

---

### Edge Cases

- 提供非法或不支持的颜色字符串时，如何返回可读的错误信息并保持调用方可恢复。
- 输入包含越界分量（如 RGB>255、负值、超出色域的 OKLCH），系统如何裁剪或提示。
- 同一颜色多次变换或链式操作时，数值精度与舍入策略如何保证一致性。
- 未提供 alpha 时的默认透明度策略，以及输出格式缺省 alpha 的处理。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系统必须提供统一的颜色数据模型，可表达至少 HEX、RGB(A)、HSL(A)、OKLCH 的解析结果及元数据（如透明度、色域标识）。
- **FR-002**: 系统必须支持将上述输入格式解析为统一模型，并能按调用方请求输出指定格式字符串或结构化数据。
- **FR-003**: 系统必须提供可组合的颜色变换能力（如亮度、饱和度、色相、透明度调整），并在连续操作后保持可预测结果。
- **FR-004**: 系统必须在输入非法或超界时给出可读错误信息或安全回退，不得产生未定义状态。
- **FR-005**: 系统必须提供 headless 的接口设计（纯函数/无框架状态管理），以便在无 UI 依赖下独立使用。
- **FR-006**: 系统必须为 React18 与 Vue3 提供对等的壳层接口，暴露与核心一致的数据与回调，支持在框架环境中直接消费。
- **FR-007**: 系统必须提供可选的基础样式资源（如样式表或 CSS 变量），允许调用方选择使用或完全自定义，且关闭样式时功能不受影响。
- **FR-008**: 系统必须提供示例或最小演示，证明核心解析/变换与 React/Vue 壳层能够协同工作并保持输出一致。
- **FR-009**: 系统必须支持可注册的解析/格式化/变换插件，插件需声明唯一名称、适用空间并通过接口校验，官方需提供扩展示例。
- **FR-010**: 系统必须提供结构化错误输出，包含错误类型、相关分量/字段、可读描述（不少于 15 字）和机器可解析的错误码。
- **FR-011**: Vue 壳层必须支持 v-model（`modelValue` + `update:modelValue`），事件负载为规范化 ColorModel，需与核心输出保持一致性。

### Non-Functional Constraints

- **NFR-001**: 轻量级目标：核心包（ESM 发布物）gzip ≤ 30KB，运行时外部依赖最多 2 个；React/Vue 壳层各自 gzip ≤ 25KB，除对应框架外最多 1 个额外运行时依赖。
- **NFR-002**: 跨框架兼容：React 版本要求 ≥18.2，Vue 版本要求 ≥3.3；支持 CSR 与常规 Vite SSR 场景；发布 ESM 与 CJS 双入口；运行环境要求 Node ≥18。
- **NFR-003**: 稳定性与变更控制：遵循语义化版本，破坏性变更仅允许在主版本发布；需至少提前 2 周公告并附迁移指南；次/补丁版本仅限向后兼容调整与修复。
- **NFR-004**: 代码规范：统一使用 `@antfu/eslint-config` 作为 ESLint 配置基线，不引入 Prettier；采用 `eslint.config.js` 集中配置且不使用 `.eslintignore`。

### Key Entities *(include if feature involves data)*

- **Color Model**: 代表统一的颜色数据结构，包含 `space`（枚举：hex、rgb、hsl、oklch 等）、`values`（按空间定义的分量范围/单位）、`alpha`（0-1，默认 1）、`source`（原始格式标记），数值默认保留 4 位小数。
- **Format Request**: 描述目标输出格式及精度/舍入需求的指令，用于从统一模型生成字符串或结构化结果。
- **Transformation Stack**: 记录对统一模型应用的变换序列，包括操作类型、参数与顺序，用于重现或撤回变换。

### Assumptions

- 底层色彩数学基于成熟的第三方色彩引擎，以减少自研风险并保证结果稳定。
- 主要面向现代前端框架生态的应用集成，默认兼容当前主流版本的 React 与 Vue。
- 默认以轻量化工具库形态交付，不附带重型 UI 依赖，样式资源保持可选。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 至少 95% 的合法 HEX、RGB(A)、HSL(A)、OKLCH 输入在单次调用内被解析并转换为统一模型，且输出目标格式与预期一致（以基准用例比对验证）。
- **SC-002**: 对同一颜色的不同输入格式，转换后输出为同一目标格式时结果一致，色值差异在可接受阈值内（测试用例全部通过）。
- **SC-003**: 对连续颜色变换操作，结果与预期变换链一致，功能测试覆盖主要变换组合且通过率 ≥ 95%。
- **SC-004**: React 与 Vue 壳层接入示例均能在 5 分钟内完成颜色输入、变换与输出验证流程（以可重复演示为准），且默认样式可独立开关不影响功能。

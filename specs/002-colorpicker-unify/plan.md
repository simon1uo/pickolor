# Implementation Plan: 跨框架 ColorPicker 统一体验

**Branch**: `002-colorpicker-unify` | **Date**: 2025-12-05 | **Spec**: specs/002-colorpicker-unify/spec.md
**Input**: Feature specification from `/specs/002-colorpicker-unify/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

统一 React/Vue ColorPicker 触发器与弹层体验，覆盖受控/非受控、格式切换、预设/历史与键盘可访问性；保持核心颜色模型单一来源，接口负载一致，并沿用样式变量体系。技术上依托现有 TypeScript + colord 适配层、pnpm workspace、多包 core/react/vue/styles 架构，遵循 Constitution 的 headless + 薄适配壳模式。

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x, Node ≥18  
**Primary Dependencies**: colord（通过核心适配层）、pnpm workspace、tsup、Vite（示例/壳层开发）  
**Storage**: N/A（组件内存状态与可选外部驱动历史）  
**Testing**: npm/pnpm test + lint（基于 @antfu/eslint-config），需覆盖键盘/拖拽同步与受控/非受控回调  
**Target Platform**: Web（React ≥18.2、Vue ≥3.3，CSR + 需兼容 Vite SSR）  
**Project Type**: 多包前端库（core/react/vue/styles）  
**Performance Goals**: 核心包 gzip ≤30KB，壳层 gzip ≤25KB，0 额外运行时依赖（除 colord）  
**Constraints**: Tree-shaking 友好；样式可选但不影响 A11y/功能；统一 ColorModel 为单一来源  
**Scale/Scope**: 组件级复用，示例与测试需覆盖主要交互与格式切换场景

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Core remains framework-agnostic and headless; no React/Vue/styling coupling inside core packages.
- Color data model stays unified and authoritative across all packages and demos.
- Internal logic stays minimal; prefer mature color-processing libraries instead of bespoke math.
- UI shells are thin adapters; optional CSS is additive, not required for functionality or accessibility.
- APIs stay predictable and documented; any breaking change includes rationale and migration guidance.

**Gate Status**: Passed — 方案保持 headless 核心 + 薄壳层，单一 ColorModel，不新增运行时依赖。

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
packages/
├── core/        # 颜色模型与转换的 headless 能力
├── react/       # React 适配壳层与示例
├── vue/         # Vue 适配壳层与示例
└── styles/      # 可选样式变量与类名体系

specs/
└── 002-colorpicker-unify/  # 本次规格、研究与计划文档
```

**Structure Decision**: 采用现有 pnpm 多包结构，核心与壳层分离，样式包可选；计划与研究文件存于 `specs/002-colorpicker-unify/`。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

## Phase 0 — Research (完成)

- 不存在剩余 NEEDS CLARIFICATION 项；研究决策已在 `research.md`：  
  - 单一 HSVA ColorModel；格式切换基于模型重格式化；历史默认容量与去重；预设外部配置；复制/清除可键盘触达。  
- 输出：`specs/002-colorpicker-unify/research.md`

## Phase 1 — Design & Contracts (完成)

- 数据模型：`specs/002-colorpicker-unify/data-model.md`  
  - ColorModel/FormatView/PresetColor/HistoryEntry 字段与规则。  
- 合同：`specs/002-colorpicker-unify/contracts/component-events.md`  
  - React/Vue 回调负载一致，格式切换、复制、清除、键盘行为约定。  
- 快速指引：`specs/002-colorpicker-unify/quickstart.md`  
- Agent 上下文：`.specify/scripts/bash/update-agent-context.sh codex` 已执行（AGENTS.md 更新）。

## Phase 2 — Planning Prep

- 下一步：进入 `/speckit.tasks` 将功能拆解为可执行任务，围绕受控/非受控、格式切换、预设/历史、A11y 路径和测试覆盖。  
- 继续保持 Constitution gate，避免在 core 引入 UI 依赖或冗余颜色算法。

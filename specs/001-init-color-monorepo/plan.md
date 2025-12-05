# Implementation Plan: Pickolor 跨框架色彩工具库 MVP

**Branch**: `001-init-color-monorepo` | **Date**: 2025-12-04 | **Spec**: specs/001-init-color-monorepo/spec.md
**Input**: Feature specification from `/specs/001-init-color-monorepo/spec.md`

## Summary

在 pnpm workspace 下建立多包轻量工具库：核心 `@pickolor/core` 提供纯函数解析/格式化/变换，色彩计算委托第三方库并通过适配层隔离；`@pickolor/react`、`@pickolor/vue` 作为薄壳绑定最小框架依赖；可选样式包输出可裁剪 CSS。构建与开发基于 Vite + tsup，输出 ESM（含类型声明）并支持 CJS 入口，保持 tree-shaking 与极小运行时体积。

## Technical Context

**Language/Version**: TypeScript 5.x，Node ≥18  
**Primary Dependencies**: colord（色彩引擎，通过适配层调用）、Vite（开发/示例）、tsup（打包）、React 18.2 壳层、Vue 3.3 壳层  
**Storage**: N/A  
**Testing**: Vitest + @testing-library/react / @testing-library/vue（针对壳层），内部纯函数单测  
**Target Platform**: 现代浏览器与 Node ≥18（含常规 Vite SSR 场景）  
**Project Type**: pnpm workspace monorepo 的多包库（core/react/vue/styles）  
**Performance Goals**: 解析/格式化/基本变换单次调用耗时 p95 < 5ms（本地基准），样式/壳层交互无明显阻塞  
**Constraints**: 包体约束（核心 gzip ≤30KB、壳层 ≤25KB）、运行时依赖约束（核心≤2、壳层额外≤1）、遵循 SemVer 与提前公告规则、纯函数核心不依赖框架或浏览器特性  
**Scale/Scope**: 首期交付 3 个核心包（core/react/vue）+ 可选 styles，附带最小示例与演示

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Core remains framework-agnostic and headless; no React/Vue/styling coupling inside core packages. ✅
- Color data model stays unified and authoritative across all packages and demos. ✅
- Internal logic stays minimal; prefer mature color-processing libraries instead of bespoke math. ✅
- UI shells are thin adapters; optional CSS is additive, not required for functionality or accessibility. ✅
- APIs stay predictable and documented; any breaking change includes rationale and migration guidance. ✅

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
```text
packages/
├── core/           # 纯函数逻辑，依赖 colord 适配层
├── react/          # React 18 薄壳，最小绑定
├── vue/            # Vue 3 薄壳，最小绑定
└── styles/         # 可选样式与 CSS 变量

examples/
├── react/          # React 示例（含 SSR 校验入口可选）
└── vue/            # Vue 示例

scripts/            # 构建/发布/校验脚本（如 pnpm helpers）
configs/            # 共享 tsconfig、lint、vite 配置
tests/              # 跨包集成/基准测试（如性能与契合度）
```

**Structure Decision**: 采用 pnpm workspace 多包布局：packages 下 core/react/vue/styles，各有独立入口与构建；configs 存放共享配置；examples 提供 React/Vue 演示；tests 进行跨包集成与性能验证。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

## Phase 0: Research（完成）

- 输出：`specs/001-init-color-monorepo/research.md`。
- 结论：使用 colord 经适配层；核心/壳层包体与依赖上限已量化；支持 React ≥18.2 / Vue ≥3.3，CSR+Vite SSR；统一数据模型字段、精度与范围；SemVer 变更窗口与公告要求；插件接口与结构化错误规范；开发用 Vite，打包用 tsup，输出 ESM+CJS+d.ts 并保持 tree-shaking。
- 未决项：无 NEEDS CLARIFICATION。

## Phase 1: Design & Contracts（完成）

- 数据模型：见 `specs/001-init-color-monorepo/data-model.md`，覆盖 ColorModel/FormatRequest/Transformation/Stack 字段、范围与校验。
- 合约：见 `specs/001-init-color-monorepo/contracts/core.md`，提供核心 API TypeScript 签名与错误契约；壳层需保持与核心一致的模型与事件。
- 快速开始：见 `specs/001-init-color-monorepo/quickstart.md`，包含安装、核心示例、React/Vue 示例（含 Vue v-model 用法）、构建与约束提醒。
- 宪法复核：核心保持 headless，单一数据模型，壳层最小绑定，依赖轻量，API 变更遵循 SemVer + 公告窗口。当前无违例，无需复杂度豁免。

## Phase 2: Tasks（待 `/speckit.tasks` 生成）

- 将在任务阶段拆分具体执行步骤与验收项。

# Research - Pickolor 跨框架色彩工具库 MVP

## Decisions

### 色彩计算依赖与隔离
- **Decision**: 使用成熟的色彩引擎（colord）作为唯一核心外部运行时依赖，通过适配层封装调用，避免直接耦合具体实现。
- **Rationale**: colord 体积小、API 稳定且支持现代色彩空间扩展；适配层便于未来替换或扩展。
- **Alternatives considered**: tinycolor（现代空间支持较弱）、culori（功能强但体积更大）、自研算法（违背轻量与成熟依赖原则）。

### 包体与依赖约束
- **Decision**: 核心包 gzip ≤30KB，运行时外部依赖 ≤2；React/Vue 壳层各自 gzip ≤25KB，除框架外最多 1 个额外运行时依赖。
- **Rationale**: 符合“轻量级”目标并保证易于集成与 tree-shaking。
- **Alternatives considered**: 更宽松体积上限（增加加载成本）；无体积约束（违背轻量目标）。

### 跨框架兼容
- **Decision**: 支持 React ≥18.2、Vue ≥3.3；CSR 与常规 Vite SSR；发布 ESM + CJS 双入口；Node ≥18。
- **Rationale**: 覆盖主流现代栈与 SSR 场景，兼顾生态兼容性。
- **Alternatives considered**: 降低版本兼容（增加维护成本且价值有限）；仅 ESM（减少 CJS 兼容性）。

### 统一数据模型
- **Decision**: 模型包含 space 枚举（hex/rgb/hsl/oklch 等）、values（按空间定义范围/单位）、alpha（0-1，默认 1）、source（原始格式），默认保留 4 位小数。
- **Rationale**: 确保跨格式一致性与可测试性，支持精度控制。
- **Alternatives considered**: 自由字段模型（降低一致性）；不约束精度（测试与对齐困难）。

### API 稳定性
- **Decision**: 遵循 SemVer；破坏性变更仅主版本；至少提前 2 周公告并提供迁移指南；次/补丁仅向后兼容。
- **Rationale**: 保障集成方可预期升级，降低破坏性影响。
- **Alternatives considered**: 次版本允许破坏性变更（增加风险）；无公告窗口（降低可预期性）。

### 可扩展与开发者友好
- **Decision**: 提供可注册的解析/格式化/变换插件接口（唯一名称、适用空间、校验）；错误信息需包含类型、分量/字段、可读描述（≥15 字）、机器可解析错误码；文档提供扩展示例。
- **Rationale**: 兼顾扩展性与可用性，便于集成与调试。
- **Alternatives considered**: 无插件机制（可扩展性不足）；无结构化错误（调试成本高）。

### 构建与输出
- **Decision**: 开发用 Vite；打包用 tsup；输出 ESM + CJS，附带 .d.ts；保证 tree-shaking（仅使用 ESM 入口、副作用标记）。
- **Rationale**: 符合轻量工具库最佳实践，兼顾多环境兼容。
- **Alternatives considered**: 仅 Vite 构建（输出控制有限）；Rollup 自建配置（复杂度增加）。

## Resolved NEEDS CLARIFICATION

当前无未决澄清项。

## Build size & dependency audit (T031)

- Context: pnpm build (tsup) on Node ≥18.
- @pickolor/core: gzip dist/index.mjs 2.53 KB; dist/index.cjs 2.59 KB; runtime deps: 1 (colord). ✅ within ≤30 KB gzip, deps ≤2.
- @pickolor/react: gzip dist/index.js 0.60 KB; dist/index.cjs 0.63 KB; runtime extra deps: 0 (peers react/react-dom/@pickolor/core). ✅ within ≤25 KB gzip, extra deps ≤1.
- @pickolor/vue: gzip dist/index.js 1.35 KB; dist/index.cjs 1.36 KB; runtime extra deps: 0 (peers vue/@pickolor/core). ✅ within ≤25 KB gzip, extra deps ≤1.
- @pickolor/styles (optional): gzip dist/styles.css 0.53 KB; no runtime deps. Informational only (not part of shell limits).

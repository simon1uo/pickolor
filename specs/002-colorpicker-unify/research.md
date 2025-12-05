# Phase 0 Research — 002-colorpicker-unify

## Decisions

- **统一颜色模型 = HSVA（含 alpha），核心保持 headless**  
  - Rationale: 与现有 colord 适配层兼容，易于映射到 HEX/RGBA/HSLA/未来 OKLCH；单一来源支持板、滑条、输入同步。  
  - Alternatives considered: 直接用 RGBA（旋钮映射不直观）；OKLCH 作为主模型（现有需求未强制，增加复杂度）。

- **格式切换策略 = 基于当前 ColorModel 重新格式化，输入校验后回填模型**  
  - Rationale: 保证切换后值一致性，防止跨格式累计误差；错误路径可通过 onError 返回。  
  - Alternatives considered: 直接沿用输入字符串（易残留非法值）；每格式独立状态（破坏单一来源）。

- **历史记录 = 内存维护，去重按颜色值，默认容量 10，可由外部覆盖**  
  - Rationale: 满足快速回溯需求且不引入持久化；可接受的默认体验。  
  - Alternatives considered: 浏览器持久化（超出当前范围）；无限历史（不符合体积与简洁原则）。

- **预设来源 = 外部可配置列表，空则不显示区域**  
  - Rationale: 保持 YAGNI，避免硬编码预设；适配不同设计体系。  
  - Alternatives considered: 内置固定预设（可能与主题不符）。

- **复制与清除交互 = 键盘可触达，失败需反馈**  
  - Rationale: 满足 A11y 要求，减少失败无感知。  
  - Alternatives considered: 仅鼠标触发（不符 A11y）。

## Rationale Consolidation

决策围绕 Constitution 的 headless + 单一 ColorModel：所有视图共享 HSVA 来源，格式切换与历史/预设均围绕该模型，不新增持久化或额外依赖，保持包体积与可摇树性。

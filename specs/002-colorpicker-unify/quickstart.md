# Quickstart — 002-colorpicker-unify

1) 阅读规格与研究  
- `specs/002-colorpicker-unify/spec.md`：功能范围与成功标准  
- `specs/002-colorpicker-unify/research.md`：决策与取舍  
- `specs/002-colorpicker-unify/data-model.md`：实体与状态关系  
- `specs/002-colorpicker-unify/contracts/component-events.md`：回调/负载约定

2) 规划开发与测试场景  
- 受控/非受控、格式切换、预设/历史、复制、键盘与拖拽路径。  
- A11y：触发器、滑条、色板、清除/复制按钮的聚焦与键盘操作。

3) 实现与验证（建议顺序）  
- 核心 ColorModel 同步 + 格式切换校验。  
- 触发器 + Popover 开合与外部点击关闭。  
- 板/滑条/输入联动；预设/历史应用；清除与复制。  
- React/Vue API 负载一致性；受控/v-model 回调。  
- 测试与示例覆盖主要路径。

4) 质量检查  
- 对照 Constitution：core headless、单一 ColorModel、薄壳层、可选样式。  
- 体积与依赖约束；Tree-shaking；0 额外运行时依赖（除 colord）。  
- 键盘与触控交互的可访问性。

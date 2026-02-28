# STYLES KNOWLEDGE BASE
## OVERVIEW
`@pickolor/styles` is an optional CSS-only package that defines shared tokens and class rules used by both React and Vue shells.
## STRUCTURE
```text
packages/styles/
├── src/styles.css   # single source file (231 lines)
├── dist/styles.css  # build output (file copy)
└── package.json
```
## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Design tokens | `src/styles.css` `:root` block | `--pickolor-*` variables (radius, spacing, colors, typography, shadow) |
| Picker containers | `src/styles.css` | `.pickolor-react-picker`, `.pickolor-vue-picker` |
| Input styles | `src/styles.css` | `.pickolor-react-input`, `.pickolor-vue-input` + focus/invalid states |
| Popover | `src/styles.css` | `.pickolor-popover` + `[data-open]` + Vue transition classes |
| Slider/Panel | `src/styles.css` | `.pickolor-slider`, `.pickolor-saturation-panel`, thumb styles |
| Swatch | `src/styles.css` | `.pickolor-swatch` + `.is-empty` checkerboard |
| Publish entry | `package.json` | All exports point to `./dist/styles.css` |
## CSS TOKENS
```css
--pickolor-font-family    --pickolor-radius    --pickolor-border
--pickolor-border-focus   --pickolor-bg        --pickolor-panel-bg
--pickolor-text           --pickolor-muted     --pickolor-accent
--pickolor-shadow         --pickolor-gap       --pickolor-swatch-size
--pickolor-popover-transition-ms  /* set inline by shells */
```
## CONVENTIONS
- Keep selectors framework-agnostic; class names must work in both shells.
- Prefer CSS variables for theming hooks; avoid hardcoded values in component rules.
- Preserve `pickolor-` naming prefix for public class contract.
- Build is `cp src/styles.css dist/styles.css` — no bundler, no PostCSS.
- `sideEffects: ["./dist/styles.css"]` in package.json for tree-shaking.
## ANTI-PATTERNS
- Do not add runtime JS/TS into this package.
- Do not rename public `pickolor-*` classes without cross-shell coordination.
- Do not place shell-specific layout assumptions in shared styles.
- Do not publish without updated `dist/styles.css`.
- Do not use hardcoded colors/sizes; use `--pickolor-*` variables.
## COMMANDS
```bash
pnpm --filter @pickolor/styles build
pnpm --filter @pickolor/styles lint
```
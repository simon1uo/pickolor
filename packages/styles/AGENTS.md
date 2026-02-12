# STYLES KNOWLEDGE BASE

## OVERVIEW
`@pickolor/styles` is an optional CSS-only package that defines shared tokens and class rules used by both React and Vue shells.

## STRUCTURE
```text
packages/styles/
├── src/styles.css
├── dist/styles.css
└── package.json
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Design tokens | `src/styles.css` | CSS variables under `:root` (radius, spacing, colors, typography) |
| Component classes | `src/styles.css` | `pickolor-*` selectors shared by React/Vue |
| Publish entry | `package.json` | Exports point to `./dist/styles.css` |
| Build behavior | `package.json` | Build is file copy, not bundling |

## CONVENTIONS
- Keep selectors framework-agnostic; class names must work in both shells.
- Prefer CSS variables for theming hooks; avoid hardcoded values in component rules.
- Preserve `pickolor-` naming prefix for public class contract.
- Keep source and dist aligned (`src/styles.css` -> `dist/styles.css`).

## ANTI-PATTERNS
- Do not add runtime JS/TS into this package.
- Do not rename public `pickolor-*` classes without cross-shell coordination.
- Do not place shell-specific layout assumptions in shared styles.
- Do not publish without updated `dist/styles.css`.

## COMMANDS
```bash
pnpm --filter @pickolor/styles lint
pnpm --filter @pickolor/styles test
pnpm --filter @pickolor/styles build
```

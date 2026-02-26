# Release Checklist

Use this checklist before publishing packages.

## Prerequisites
- Changesets exist for publishable changes (`.changeset/*`).
- CI is green on `main`.

## Build and verify
```bash
pnpm build
pnpm release:check
```

## Package artifacts
Each package must contain:
- `dist/`
- `README.md`
- `LICENSE`

## Publish
```bash
pnpm changeset publish
```

## Notes
- For trusted publishing, ensure npm CLI meets the workflow requirement.
- See `docs/release.md` for full release flow.

# Release Guide (Changesets + npm)

## Overview
- Versioning: independent per package
- Trigger: push to `main` with changesets present
- Publisher: GitHub Actions via `changesets/action`

## Create a changeset
```bash
pnpm changeset
```
Follow prompts and select affected packages and version bump.

## Local dry run (no publish)
```bash
pnpm release:dry
```

## Inspect publish artifacts
```bash
pnpm release:pack
```

## Local publish (manual)
```bash
pnpm -r build
pnpm changeset publish
```

## GitHub Actions publish
- Requires `NPM_TOKEN` secret with npm publish permission.
- On `main` push, Changesets will publish when changesets exist.

## Notes
- Scoped packages require `publishConfig.access=public`.
- Use `pnpm changeset version` to preview version bumps locally.

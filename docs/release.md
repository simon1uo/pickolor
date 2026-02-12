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

## Future releases
1) For any publishable change, create a changeset
```bash
pnpm changeset
```
2) Merge PR to `main` and wait for CI + release workflow

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
- Configure npm Trusted Publishing for this repository and workflow.
- Release runs only after CI succeeds on `main`.
- Changesets will publish when changesets exist.

## Notes
- Scoped packages require `publishConfig.access=public`.
- Use `pnpm changeset version` to preview version bumps locally.
- Release requires `dist/`, `README.md`, and `LICENSE` in each package.
- Trusted publishing requires npm CLI 11.5.1+ in CI.

# ADR 001: Core and UI Shell Boundaries

## Status
Accepted

## Context
Pickolor ships a framework-free core and thin UI shells for React and Vue. We need clear boundaries so
color math and error contracts stay consistent across frameworks while UI interaction stays flexible.

## Decision
- `@pickolor/core` is the single source of truth for parse/format/transform and error shapes.
- `@pickolor/react` and `@pickolor/vue` only handle UI state, interaction, and rendering.
- `@pickolor/styles` stays CSS-only and framework-agnostic.

## Consequences
- Shared behavior and error contracts remain consistent across frameworks.
- UI shells may duplicate some interaction logic, but avoid leaking framework specifics into core.
- Changes to styles must preserve the shared class contract across React and Vue.

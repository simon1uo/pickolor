<!--
Sync Impact Report
- Version change: 0.0.0 → 1.0.0
- Modified principles: [new adoption] → Lightweight Framework-Agnostic Core; Unified Color Data Model; Library-First Minimal Logic; Clear Core/UI Separation; Predictable APIs & Developer UX
- Added sections: Architecture Guardrails; Workflow & Quality Gates
- Removed sections: none (template placeholders replaced)
- Templates requiring updates: ✅ .specify/templates/plan-template.md | ⚠ none pending
- Follow-up TODOs: none
-->

# Pickolor Constitution

## Core Principles

### I. Lightweight Framework-Agnostic Core
Headless-first design with zero hard dependencies on React, Vue, or styling frameworks; lean dependency footprint; ESM-first TypeScript outputs to keep bundles small and portable.

### II. Unified Color Data Model
Single canonical color representation across core and adapters; deterministic parsing/conversion; alpha and channel precision preserved; no divergent state shapes between platforms.

### III. Library-First Minimal Logic
Prefer mature color-processing libraries for heavy lifting; internal code remains thin wrappers that compose, not reimplement; avoid bespoke algorithms unless gaps are proven.

### IV. Clear Core/UI Separation
Core exposes pure logic and state contracts only; UI shells are thin adapters (React/Vue) that consume headless contracts; optional CSS is additive and never required for functionality.

### V. Predictable APIs & Developer UX
Consistent naming, event semantics, and return types across packages; stable surface to minimize breaking changes; docs and samples accompany every capability; extensibility and long-term maintainability take precedence over novelty.

## Architecture Guardrails

Monorepo uses pnpm workspaces with clear package boundaries (`@pickolor/core`, `@pickolor/react`, `@pickolor/vue`, optional styles). Core stays UI-agnostic and dependency-light. Color data model is the single source of truth for any adapter or demo. Optional CSS uses BEM-like classes and CSS variables; absence of CSS must not degrade accessibility or functionality. Tests and examples must cover both headless mode and shell usage to confirm consistency.

## Workflow & Quality Gates

Specifications, plans, and tasks must trace back to the principles above: core-first, adapter-thin, predictable APIs. Reviews block changes that introduce framework coupling into core, duplicate color math already provided by mature libraries, or diverge data models across packages. Any new capability must document API shape, events, and extensibility points. Backwards-incompatible changes require justification, migration notes, and a version bump plan across packages.

## Governance

This constitution supersedes other process documents for scope, architecture, and API stability. Amendments require documented rationale, version bump per semantic rules, and review to confirm compatibility with principles. Compliance is reviewed during planning and code review; Constitution Check gates in plan/tasks must reflect the active principles. Ratification date is the adoption of the first non-template version; Last Amended updates on each change.

**Version**: 1.0.0 | **Ratified**: 2025-12-04 | **Last Amended**: 2025-12-04

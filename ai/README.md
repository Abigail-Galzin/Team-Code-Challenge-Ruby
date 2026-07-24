# SupportFlow — Technical Documentation

This folder is a from-source technical review of the whole repository (backend + frontend),
written 2026-07-24 against the `TB-183-comments-api-react-client` branch. Every fact below was
read directly from the code, not inferred from prior documentation — where an existing doc
(`README.md`, `DECISIONS.md`) turned out to be stale, that's called out explicitly rather than
silently corrected.

## Start here

1. **[`architecture-overview.md`](architecture-overview.md)** — the system as a whole: tech
   stack, request/response envelope convention, domain summary, and sequence diagrams for the
   two core flows (creating a support request, adding a comment).

## Backend (Rails 8.1 API-only + PostgreSQL)

2. **[`backend/README.md`](backend/README.md)** — directory structure, the three domain
   models (`TeamMember`, `SupportRequest`, `Comment`) with every validation/scope/callback,
   the support-request status state machine, controllers, config, gems, and test coverage.
3. **[`backend/data-model.md`](backend/data-model.md)** — ER diagram, full column/index/FK
   reference for `team_members` / `support_requests` / `comments`, and the migration history.
4. **[`backend/api-reference.md`](backend/api-reference.md)** — every endpoint (support
   requests, team members, comments, dashboard), with params, example request/response bodies,
   and every status code + error message the API can return.

## Frontend (Vite + React 19 + TypeScript)

5. **[`frontend/README.md`](frontend/README.md)** — directory structure, routing table, a
   per-view walkthrough (what each page does, calls, and validates), the services/API layer,
   domain types, validation approach, and the CSS design-system tokens.
6. **[`frontend/component-tree.md`](frontend/component-tree.md)** — route→view and
   view→component dependency diagrams (verified against actual imports), a full prop
   reference for every reusable component, and a diagram of how the UI mirrors the backend's
   support-request status state machine.

## Cross-cutting

7. **[`known-issues.md`](known-issues.md)** — 15 verified inconsistencies found during this
   review (env/config drift, a couple of small UI bugs, type mismatches, and stale existing
   docs), each with file/line references, impact, and a suggested fix. Treat this as a
   technical-debt punch list, not a bug tracker — nothing in it is currently blocking.

## Also in this repo

- [`prompt-initial-ui.md`](prompt-initial-ui.md) — the original brief used to bootstrap the
  frontend's foundation (routes, layout, component library, design language). Several things
  it describes (mock-data-only pages, no backend integration) have since been superseded by
  real API integration — see [`known-issues.md`](known-issues.md#11-frontendreadmemd-describes-a-pre-integration-state-that-no-longer-exists).
- [`../README.md`](../README.md) — commit message conventions (Conventional Commits via
  Husky/commitlint).
- [`../DECISIONS.md`](../DECISIONS.md) — the team's original architecture-decision record
  (why Rails API, why Postgres, why no auth yet, etc.). Partially superseded by the current
  API surface — see [`known-issues.md`](known-issues.md#14-root-decisionsmd-describes-the-backend-as-pre-api-no-domain-endpoints-exist-yet).

## Diagram index

All diagrams are [Mermaid](https://mermaid.js.org/) code blocks that render natively on
GitHub and in most Markdown viewers (including this one, if opened in an editor with Mermaid
preview support).

| Diagram | Where |
|---|---|
| System architecture (SPA ↔ Rails API ↔ Postgres/Solid) | [`architecture-overview.md`](architecture-overview.md#1-system-diagram) |
| Domain summary ER diagram | [`architecture-overview.md`](architecture-overview.md#3-domain-at-a-glance) |
| Sequence: create a support request | [`architecture-overview.md`](architecture-overview.md#5-end-to-end-flow-creating-a-support-request) |
| Sequence: add a comment | [`architecture-overview.md`](architecture-overview.md#6-end-to-end-flow-adding-a-comment) |
| Full ER diagram (columns, FKs) | [`backend/data-model.md`](backend/data-model.md#1-entity-relationship-diagram) |
| Support request status state machine | [`backend/README.md`](backend/README.md#status-state-machine-and-business-rules) |
| Route → View map | [`frontend/component-tree.md`](frontend/component-tree.md#1-route--view-map) |
| View → Component dependency graph | [`frontend/component-tree.md`](frontend/component-tree.md#2-view--component-dependency-graph) |
| Status machine mirrored in `RequestForm` UI | [`frontend/component-tree.md`](frontend/component-tree.md#4-support-request-state--ui-mapping) |

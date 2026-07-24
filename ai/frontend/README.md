# Frontend — SupportFlow SPA

Vite + React 19 + TypeScript single-page application. `npm run dev` serves it on
`http://localhost:5173`. No state-management library, no CSS framework, no server-side
rendering — everything is local `useState`/`useEffect` and plain CSS.

See also: [`component-tree.md`](component-tree.md) for the full component inventory and
diagrams, and [`known-issues.md`](../known-issues.md) for inconsistencies found in this layer.

## 1. Directory structure

```
frontend/src/
├── router/AppRouter.tsx          # all 9 routes, flat, no nesting
├── App.tsx                       # <BrowserRouter><AppRouter /></BrowserRouter>
├── main.tsx                      # ReactDOM root, StrictMode
├── views/                        # one folder per page
│   ├── Dashboard/
│   ├── SupportRequestList/
│   ├── RequestForm/              # handles both create AND edit
│   ├── RequestDetails/           # + co-located CommentsSection.tsx
│   ├── TeamMembers/
│   ├── TeamMemberForm/           # handles both create AND edit
│   └── ComponentsDemo/           # internal Storybook-style catalog
├── components/                   # reusable, presentational, no business logic
│   ├── common/   (Button, Badge, StatusBadge, PriorityBadge, OverdueBadge, Chip, Avatar, Divider)
│   ├── layout/   (AppLayout, Navbar, Header, Breadcrumb, PageContainer, Card)
│   ├── form/     (TextBox, TextArea, Dropdown, Checkbox, RadioButton, Switch)
│   ├── data/     (TableGrid, Pagination, Grid)
│   └── feedback/ (Alert, EmptyState, ErrorState, LoadingSpinner, ConfirmationDialog)
├── services/                     # API layer
│   ├── apiClient.ts               # single axios instance
│   ├── dashboardApi.ts
│   ├── supportRequestsApi.ts
│   ├── commentsApi.ts
│   ├── teamMembersApi.ts
│   └── mockData.ts                # only remaining consumer: ComponentsDemo
├── types/                        # domain types (support.ts, teamMember.ts, dashboard.ts, pagination.ts, mock.ts, index.ts barrel)
├── validations/                  # teamMemberValidation.ts (custom, not yup/zod)
├── utils/                        # format.ts, validators.ts
├── styles/                       # variables.css, base.css, utilities.css
└── test/setup.ts                 # Vitest + jest-dom bootstrap
```

## 2. Routing (`src/router/AppRouter.tsx`)

All 9 routes are declared flat inside a single `<Routes>` — there is no router-level layout
route or `<Outlet>`; each view composes `AppLayout` itself.

| Path | View | Notes |
|---|---|---|
| `/` | `Dashboard` | Aggregate stats cards |
| `/requests` | `SupportRequestList` | Filterable/paginated table |
| `/requests/new` | `RequestForm` | Create mode (`useParams().id` is `undefined`) |
| `/requests/:id` | `RequestDetails` | Detail view + comments |
| `/requests/:id/edit` | `RequestForm` | Edit mode (same component as create) |
| `/team-members` | `TeamMembers` | Card grid, deactivate flow |
| `/team-members/new` | `TeamMemberForm` | Create mode |
| `/team-members/:id/edit` | `TeamMemberForm` | Edit mode (same component as create) |
| `/components` | `ComponentsDemo` | Component catalog — **not linked from `Navbar`**, direct-URL only |

`Navbar` (`components/layout/Navbar.tsx`) hard-codes only 3 nav links: `/` (Dashboard),
`/requests`, `/team-members`. `/components` and the `/new`/`/edit` routes are reachable only
by direct navigation (buttons within pages, or manual URL entry).

## 3. Views

- **Dashboard** — `fetchDashboardStats()` on mount → three `Grid columns={3}` blocks of
  `Card`s: totals (total/overdue/unassigned), status breakdown (`StatusBadge` per bucket),
  priority breakdown (`PriorityBadge` per bucket). Read-only, no forms.
- **SupportRequestList** — `TableGrid` of paginated support requests. Filters: status,
  priority, assignee (via `searchTeamMembers`), overdue-only, unassigned-only, and a
  300ms-debounced title search (`q`). Actions column has working `View`/`Edit` navigation
  buttons and a **disabled, commented-out `Delete` button** (dead code — no delete endpoint
  exists). `statusFilterOptions` only lists 4 of the 5 values in the `RequestStatus` type (see
  [known-issues.md](../known-issues.md)).
- **RequestForm** — dual-purpose create/edit (`useParams().id` decides mode). Renders `TextBox`,
  `TextArea`, `Dropdown` (assignee), `RadioButton` (status, with per-option `disabled` wired to
  business rules: `"open"` disabled once `initialStatus === "closed"`, `"closed"` disabled once
  `initialStatus === "resolved"` — mirroring the backend's status state machine). If the
  request being edited is already `closed`, the form is replaced entirely with an info `Alert`
  and a Back button. Validation is manual (`.trim()` truthiness on title/description), not
  schema-based.
- **RequestDetails** — fetches one request, renders a definition-list of its fields plus
  `OverdueBadge`/`StatusBadge`/`PriorityBadge`, and the co-located `CommentsSection`. Edit
  button is disabled when `status === "closed"`. New comments are merged into local state via
  an `onCommentAdded` callback — no refetch of the parent request.
- **CommentsSection** (`views/RequestDetails/CommentsSection.tsx`, not a shared component) —
  loads team members for an author `Dropdown`, validates author-selected + body length ≥ 10
  (hard-coded, matching the backend's `Comment` validation), calls `createComment`.
- **TeamMembers** — card grid from `teamMembersApi.getAll()`. Each card shows `Avatar`, name,
  an "Inactive" badge when applicable, role, email, `activeRequests` count, an Edit button, and
  — only while `active` — a Deactivate button gated behind `ConfirmationDialog`, which calls
  `teamMembersApi.update(id, { active: false })` (there is no use of the `delete` API method
  anywhere in the app; "deactivate" is the only removal path, matching the backend's one-way
  `active` switch). Fetch errors on initial load are silently swallowed (empty `catch` block).
- **TeamMemberForm** — dual-purpose create/edit, validated via
  `validations/teamMemberValidation.ts` before submit. Reads server-side `errors` array from
  axios error responses. Has a minor label typo ("Rol" instead of "Role") and a load-failure
  path that pushes an empty string into its error list (see
  [known-issues.md](../known-issues.md)).
- **ComponentsDemo** — internal, Storybook-style catalog with 17 numbered `DemoSection`s (one
  per component category from the original brief). Entirely self-contained with local state and
  the only remaining live import of `services/mockData.ts`.

## 4. Component library

Full prop-level inventory and diagrams live in [`component-tree.md`](component-tree.md).
Summary by folder:

| Folder | Components |
|---|---|
| `common/` | `Button`, `Badge` (+ `StatusBadge`, `PriorityBadge`, `OverdueBadge` derived from it), `Chip`, `Avatar`, `Divider` |
| `layout/` | `AppLayout`, `Navbar`, `Header`, `Breadcrumb`, `PageContainer`, `Card` |
| `form/` | `TextBox`, `TextArea`, `Dropdown`, `Checkbox`, `RadioButton`, `Switch` |
| `data/` | `TableGrid` (generic `<T>`, no external table library), `Pagination`, `Grid` |
| `feedback/` | `Alert`, `EmptyState`, `ErrorState`, `LoadingSpinner`, `ConfirmationDialog` |

Every component in `components/**` is typed, prop-driven, and free of imports from
`services/`/`views/` — the design intentionally keeps the library independent of business
logic so `ComponentsDemo` can exercise each one with fake data alone.

## 5. Services / API layer

**`apiClient.ts`** — single preconfigured axios instance:

```ts
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api/v1",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});
```

Every service call path is written relative to this base as `/v1/...` (e.g.
`apiClient.get("/v1/support_requests")`), which means the configured `VITE_API_BASE_URL` must
already include `/api` (so the full URL resolves to `.../api/v1/support_requests`, matching
`backend/config/routes.rb`). The committed `.env` (`http://localhost:3000/api`) gets this
right; `.env.example` (`http://localhost:3000`, missing `/api`) does not — see
[known-issues.md](../known-issues.md) for the impact on a fresh clone.

| Service file | Functions | Endpoint(s) |
|---|---|---|
| `dashboardApi.ts` | `fetchDashboardStats()` | `GET /v1/dashboard` |
| `supportRequestsApi.ts` | `fetchSupportRequests(page, filters)`, `createSupportRequest(payload)`, `fetchSupportRequest(id)`, `updateSupportRequest(id, payload)` | `GET/POST /v1/support_requests`, `GET/PATCH /v1/support_requests/:id` |
| `commentsApi.ts` | `createComment(supportRequestId, payload)` | `POST /v1/support_requests/:id/comments` |
| `teamMembersApi.ts` | `getAll`, `getById`, `create`, `update`, `delete` (unused), plus standalone `searchTeamMembers(query)` | `GET/POST /v1/team_members`, `GET/PUT/DELETE /v1/team_members/:id` |
| `mockData.ts` | `mockTeamMembers`, `mockSupportRequests`, `getSupportRequestById` (unused) | n/a — static fixtures, only imported by `ComponentsDemo` |

All request bodies wrap the payload under the resource key the backend expects
(`{ support_request: {...} }`, `{ comment: {...} }`, `{ team_member: {...} }`), matching the
Rails strong-parameter contracts in [`../backend/api-reference.md`](../backend/api-reference.md).

## 6. Types (`src/types/*`)

Core domain types live in `support.ts`:

```ts
export type RequestStatus = "open" | "assigned" | "in_progress" | "resolved" | "closed";
export type RequestPriority = "low" | "medium" | "high" | "critical";
```

`SupportRequest`, `Comment`, `TeamMemberInfo` (embedded shape), plus response wrapper types
(`SupportRequestListResponse`, `SupportRequestResponse`, `CommentResponse`) and
`CreateSupportRequestPayload`/`CreateCommentPayload` mirror the backend envelope and strong
params exactly. Two separate "team member" shapes exist: `TeamMember` (`id: string`, used by
the team-members list/CRUD views) and `TeamMemberSearchResult` (`id: number`, used by
assignee-picker dropdowns) — an inconsistency flagged in
[known-issues.md](../known-issues.md). There is no shared `role` union type; allowed role
values only exist as the `TEAM_MEMBER_ROLES` const in `validations/teamMemberValidation.ts`.

`teamMember.ts` (`FormErrors`), `dashboard.ts` (`DashboardStats`, `DashboardResponse`),
`pagination.ts` (`PaginationMeta`), and `mock.ts` (fixture-only shapes) round out the barrel
exported from `types/index.ts` — though `FormErrors` itself is **not** re-exported from that
barrel and must be imported directly from `types/teamMember`.

## 7. Validation

`validations/teamMemberValidation.ts` is the only validation module — a small, reusable
rule-composition system (not yup/zod):

```ts
export const TEAM_MEMBER_ROLES = ["developer", "qa", "support"] as const;
```

Built on generic primitives in `utils/validators.ts` (`validators.required`,
`validators.maxLength(n)`, `validators.email`, `validators.inclusion([...])`, and a
`validateField(value, fieldName, rules)` runner). `RequestForm` and `CommentsSection` do
**not** use this module — they validate inline with plain `.trim()`/length checks.

## 8. Styling / design system

Plain CSS custom properties, no framework. `index.css` imports, in order:
`variables.css` (colors, spacing, radii, shadows, typography, motion, layout tokens) →
`base.css` (resets) → `utilities.css` (small flex/spacing utility classes).

Key tokens (`variables.css`): `--primary-color` (#1976d2), `--secondary-color`,
`--success/warning/error/info-color` (+ matching `-bg` tones), `--background-color`,
`--surface-color`, `--border-color`, `--text-primary/secondary/disabled`, `--border-radius`
(6px) / `--border-radius-lg` (8px) / `--border-radius-pill`, an 8px `--spacing-xs`…`-xl` scale,
`--font-family` (Inter/Roboto), `--transition-fast/medium`, `--navbar-height` (64px),
`--content-max-width` (1200px).

Mobile-first (`min-width`) breakpoints exist in exactly 3 component stylesheets: `Grid.css`
(640px, 1024px), `PageContainer.css` (768px, 1024px — progressive padding), and `Navbar.css`
(a `max-width: 640px` shrink query, the one exception to mobile-first).

## 9. Tests (Vitest + Testing Library)

| Test file | Covers |
|---|---|
| `services/teamMembersApi.test.ts` | Exact URL/payload for every `teamMembersApi` method |
| `validations/teamMemberValidation.test.ts` | Every validation rule combination |
| `views/TeamMembers/TeamMembers.test.tsx` | Render from API, fetch-failure handling, navigation, deactivate confirm/cancel/success/failure flows |
| `views/TeamMemberForm/TeamMemberForm.test.tsx` | Validation blocking, create + navigate, server-error surfacing, edit-mode pre-fill, update flow |

No tests exist for `Dashboard`, `SupportRequestList`, `RequestForm`, `RequestDetails` /
`CommentsSection`, `ComponentsDemo`, or any individual presentational component in
`components/**`.

## 10. Key dependencies (`package.json`)

Only 4 runtime dependencies: `react`/`react-dom` 19.2.7, `react-router-dom` 7.18.1, `axios`
1.18.1. Dev/test stack: `vite` 8, `vitest` 4, `@testing-library/react` 16, `jsdom`, `oxlint`
(linting, not ESLint), `typescript` ~6.0. No `resolve.alias` path aliases are configured in
`vite.config.ts` — every import across the codebase is relative.

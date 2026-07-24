# Known Issues & Inconsistencies

Findings from an exhaustive read-through of the backend and frontend (2026-07-24). Every
item below was verified directly against source — file paths and line numbers are given so
each can be re-checked or fixed quickly. None of these are blocking for local development
today (the repo's actual `.env` happens to work), but several are worth cleaning up.

## Frontend ↔ Backend integration

### 1. `frontend/.env.example` produces a broken base URL

- **Where**: `frontend/.env.example` vs `frontend/src/services/apiClient.ts:5`
- **What**: `apiClient.ts` sets `baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api/v1"`, and
  every service file calls paths like `apiClient.get("/v1/support_requests")` — i.e. the
  service layer already assumes the base URL ends in `/api`. The committed `frontend/.env`
  correctly sets `VITE_API_BASE_URL=http://localhost:3000/api`, so today's local dev works.
  But `frontend/.env.example` — the file a new clone is meant to copy — sets
  `VITE_API_BASE_URL=http://localhost:3000` (no `/api`). Following the example verbatim
  produces requests to `http://localhost:3000/v1/support_requests`, which doesn't exist on
  the backend (`config/routes.rb` namespaces everything under `/api/v1`) and would 404.
- **Impact**: A new developer who copies `.env.example` to `.env` without noticing the
  discrepancy gets silent 404s on every API call.
- **Fix**: Change `.env.example` to `VITE_API_BASE_URL=http://localhost:3000/api`, matching
  the working `.env`. Separately, the `?? "/api/v1"` fallback in `apiClient.ts` would combine
  with a service path of `/v1/...` to produce `/api/v1/v1/...` if the env var were ever unset
  entirely — worth resolving by picking one convention (either the base URL includes `/api`
  and services use `/v1/...`, or the base URL includes `/api/v1` and services drop the
  leading `/v1`).

### 2. `teamMembersApi.delete()` calls a route that doesn't exist on the backend

- **Where**: `frontend/src/services/teamMembersApi.ts` (`delete` method) vs
  `backend/config/routes.rb` (`resources :team_members, only: [:index, :show, :create, :update]`)
- **What**: The frontend defines a `delete(id)` method that issues `DELETE /v1/team_members/:id`,
  but the backend never routes `destroy` for team members (or any resource). It is currently
  dead code — no view calls it (`TeamMembers.tsx` deactivates via `update({ active: false })`
  instead) — but if it were ever wired up it would fail with a Rails routing error, not a
  clean 404 JSON response.
- **Impact**: Low today (unused). Would be confusing if a future contributor tries to use it.
- **Fix**: Either remove the unused `delete` method, or add a real `destroy` route/action if
  hard deletion is ever intended (inconsistent with the current "team members are only ever
  soft-disabled" design — see [`backend/README.md`](backend/README.md#2-domain-models)).

## Backend data integrity

### 3. `comments.author_email` is nullable in `schema.rb` despite the migration declaring `NOT NULL`

- **Where**: `backend/db/migrate/20260723164758_create_comments.rb:5`
  (`t.string :author_email, null: false`) vs `backend/db/schema.rb:18`
  (`t.string "author_email"`, no `null: false`)
- **What**: The one migration that creates this column declares it `NOT NULL`, but the
  generated schema dump doesn't reflect that constraint. `Comment belongs_to :team_member,
  foreign_key: :author_email, primary_key: :email` is a required association by default, so
  the **model** layer already rejects a blank `author_email` — but the **database** itself
  would silently accept a `NULL` insert from raw SQL, a console session, or a future
  rake task/job that bypasses ActiveRecord validations.
- **Impact**: Low under normal API usage; a real gap only for non-Rails-validated writes.
- **Fix**: Run `bin/rails db:schema:dump` against a freshly migrated database to confirm
  whether the constraint is actually missing at the DB level (vs. a stale dump), and add a
  corrective migration (`change_column_null :comments, :author_email, false`) if so.

### 4. Pagination limit override is inconsistent between resources

- **Where**: `backend/app/controllers/api/v1/support_requests_controller.rb` (`pagy(...,
  limit_max: 10)`) vs `backend/app/controllers/api/v1/team_members_controller.rb`
  (`pagy(team_members, limit: 10)`)
- **What**: Support requests accept a client-supplied `?limit=` (capped at 10 via
  `limit_max`), while team members always return exactly 10 per page regardless of any
  `?limit=` the client sends (`limit:` fixes it, doesn't cap it).
- **Impact**: Cosmetic/API-consistency only — a frontend or API consumer expecting `?limit=`
  to work on `/team_members` the same way it does on `/support_requests` will be surprised.
- **Fix**: Decide on one behavior and apply it to both `index` actions.

## Frontend type & UI inconsistencies

### 5. `TeamMember.id` is `string`, `TeamMemberSearchResult.id` is `number`

- **Where**: `frontend/src/types/support.ts` — `TeamMember { id: string; ... }` vs
  `TeamMemberSearchResult { id: number; ... }`
- **What**: Two different TypeScript shapes model "a team member" depending on which part of
  the UI is consuming it (`TeamMember` for the team-members CRUD views via
  `teamMembersApi.getAll/getById`; `TeamMemberSearchResult` for assignee-picker dropdowns via
  `searchTeamMembers`), and their `id` fields disagree on type even though both come from the
  same backend `id: bigint` column.
- **Impact**: Low in practice (both are just carried through as opaque values today), but a
  latent footgun for any code that tries to compare or convert between the two shapes.
- **Fix**: Consolidate into one `TeamMember` type with `id: number`, or clearly document why
  two shapes exist if the split is intentional (e.g. one is a lightweight search-result DTO).

### 6. `SupportRequestList`'s status filter is missing the `"assigned"` status

- **Where**: `frontend/src/views/SupportRequestList/SupportRequestList.tsx` —
  `statusFilterOptions` lists `all/open/in_progress/resolved/closed`
- **What**: `RequestStatus` (`frontend/src/types/support.ts`) includes a 5th value,
  `"assigned"` (also handled by `StatusBadge`'s tone/label mapping), but the list view's
  status filter dropdown never offers it — a user cannot filter the table down to
  `assigned`-status requests even though the type system and badge rendering both support it.
- **Impact**: A UI gap, not a crash — if any backend record ever has `status: "assigned"` it
  will render fine in the table (via `StatusBadge`) but can't be isolated via the filter.
- **Fix**: Add `{ label: "Assigned", value: "assigned" }` to `statusFilterOptions`, or confirm
  with the backend whether `"assigned"` is actually a reachable status (the backend's
  `SupportRequest` enum only defines `open/in_progress/resolved/closed` — see
  [`backend/README.md`](backend/README.md#2-domain-models) — so `"assigned"` may be frontend-only
  dead type surface; if so, remove it from `RequestStatus` instead).

### 7. `TeamMemberForm` pushes a blank error message on load failure

- **Where**: `frontend/src/views/TeamMemberForm/TeamMemberForm.tsx:80` — `setErrors([""])`
- **What**: When loading a team member for edit (`teamMembersApi.getById`) fails, the catch
  block sets the errors array to `[""]` (one empty string) rather than a real message. Since
  `errors` is rendered as a list of `<li>` items, this produces a visible-but-empty bullet.
- **Impact**: Minor UX papercut — the user sees an empty error item instead of useful text.
- **Fix**: Replace with a real message, e.g. `setErrors(["Unable to load this team member."])`.

### 8. `TeamMemberForm` label typo: "Rol" instead of "Role"

- **Where**: `frontend/src/views/TeamMemberForm/TeamMemberForm.tsx:145`
- **What**: The `RadioButton` label reads `"Rol"` (Spanish) instead of `"Role"` — the rest of
  the UI copy is entirely in English.
- **Fix**: One-word string change to `"Role"`.

### 9. `TeamMembers` view silently swallows initial load errors

- **Where**: `frontend/src/views/TeamMembers/TeamMembers.tsx:27` — `catch (err) {}`
- **What**: If `teamMembersApi.getAll()` fails on mount, the error is caught and discarded —
  no error state is set, so the page just renders an empty grid with no explanation. (The
  separate deactivate-flow error path, a few lines below, does correctly set an error message.)
- **Impact**: A backend outage or network failure looks indistinguishable from "there are
  simply no team members yet."
- **Fix**: Set an error state in the `catch` and render it (there's already an `Alert`/
  `ErrorState` component pattern used elsewhere in the same view for the deactivate path).

### 10. Dead code: commented-out Delete button in `SupportRequestList`

- **Where**: `frontend/src/views/SupportRequestList/SupportRequestList.tsx:187-191`
- **What**: A `Delete` button (`console.log("delete", row.id)`) is written but commented out
  in the Actions column. Consistent with there being no delete endpoint for support requests
  on the backend either (see item below), but it's dead code sitting in a live file.
- **Fix**: Remove it, or track it as a placeholder for a future feature with a `// TODO` if
  deletion is genuinely planned.

## Documentation staleness

### 11. `frontend/README.md` describes a pre-integration state that no longer exists

- **Where**: `frontend/README.md:5` ("static pages backed by mock data... no backend
  integration"), `:13` (axios "not yet wired to a real API")
- **What**: Every view except `ComponentsDemo` now calls real backend endpoints through
  `services/*Api.ts` (see [`frontend/README.md`](frontend/README.md#5-services--api-layer) in
  this `ai/` doc set for the current state). The original README text predates that work.
- **Fix**: Update the intro paragraph to reflect that the frontend is now integrated with the
  live Rails API, keeping `mockData.ts`'s narrower current role (only `ComponentsDemo`) as a
  footnote rather than the headline.

### 12. `frontend/README.md`'s routes table is incomplete

- **Where**: `frontend/README.md:74-82`
- **What**: Lists 7 routes; `AppRouter.tsx` actually defines 9 — missing
  `/team-members/new` and `/team-members/:id/edit` (both exist and render `TeamMemberForm`).
- **Fix**: Add the two missing rows.

### 13. `frontend/README.md` references files/folders that don't exist

- **Where**: `frontend/README.md:58` (`src/hooks/` in the folder-structure tree),
  `frontend/README.md:216` (link to `./DECISIONS.md`)
- **What**: Neither `frontend/src/hooks/` nor `frontend/DECISIONS.md` exist in the repo (the
  project's actual `DECISIONS.md` lives at the repo root and covers both frontend and backend
  jointly).
- **Fix**: Remove the `hooks/` line from the tree (or create the folder if it's still planned
  scaffolding) and repoint the `DECISIONS.md` link to `../DECISIONS.md`.

### 14. Root `DECISIONS.md` describes the backend as pre-API ("no domain endpoints exist yet")

- **Where**: root `DECISIONS.md`, "Frontend ↔ Backend Connection" section — states
  `config/routes.rb` "currently only defines the Rails health check... no domain endpoints
  (e.g. for `TeamMember`) exist yet."
- **What**: This was true at the time it was written but the backend now has a full
  `support_requests` / `team_members` / `comments` / `dashboard` API (see
  [`backend/api-reference.md`](backend/api-reference.md)). CORS is also now enabled, contradicting
  the same document's "currently not enabled" claim.
- **Fix**: Update or add a dated addendum to `DECISIONS.md` noting the API/CORS work landed,
  rather than editing the historical rationale in place.

## Copy/grammar in live API responses (cosmetic, but part of the real contract)

### 15. Two controller-authored messages have grammar issues

- **Where**: `backend/app/controllers/api/v1/support_requests_controller.rb` — `index`
  action's `message: "The support request return correctly"` (subject/verb mismatch,
  should be "returned"); same controller's `resolved_request_cannot_become_closed` validation
  message ("cannot change from resolved to closed") renders as full message "Status cannot
  change from resolved to closed" — grammatically fine, just noting it's on the `:status`
  attribute for anyone building error-message matching in the frontend.
- **Impact**: None functionally — both are quoted verbatim in
  [`backend/api-reference.md`](backend/api-reference.md) since frontend/API-consumer code
  that string-matches on these messages must match them exactly as-is.
- **Fix**: Change `"return"` → `"returned"` in the index message if cleaning up copy; low
  priority since no test or frontend code currently depends on the literal text beyond
  display.

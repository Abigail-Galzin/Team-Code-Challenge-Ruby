# Backend — API Reference

Base path: `/api/v1`. All responses use the envelope described in
[`architecture-overview.md`](../architecture-overview.md#4-requestresponse-envelope-convention):
`{ message, data, status }`, plus `pagination` on list endpoints. No endpoint requires
authentication. No endpoint supports deletion (`destroy`) for any resource.

A live, runnable set of examples for the support-request endpoints already exists at
`backend/http_requests_support_flow.http` (20 requests) — use it directly against a running
`rails server` for manual testing.

---

## Support Requests

### `GET /api/v1/support_requests` — list

Query params (all optional, combined with AND):

| Param | Type | Effect |
|---|---|---|
| `page` | integer | Pagy page number |
| `limit` | integer | Page size, **capped at 10** (`limit_max: 10`) |
| `status` | string | Exact match on `status` |
| `priority` | string | Exact match on `priority` |
| `team_member_id` | integer | Exact match on assignee |
| `unassigned` | `"true"` | Only requests with no assignee |
| `overdue` | `"true"` | Only overdue requests (`due_date` in the past and not resolved/closed) |
| `q` | string | Case-insensitive `ILIKE` search on `title` |

Response `data` is an array of support requests, each excluding `created_at`/`updated_at`,
including a computed `overdue` boolean and a nested `team_member` (`active`, `email`, `name`,
`role`):

```json
{
  "message": "The support request return correctly",
  "data": [
    {
      "id": 5,
      "title": "Login page throws 500 error",
      "description": "...",
      "status": "open",
      "priority": "high",
      "due_date": "2026-08-01",
      "completed_at": null,
      "team_member_id": 1,
      "overdue": false,
      "team_member": { "active": true, "email": "abigail.galzin@assuresoft.com", "name": "Abigail Galzin", "role": "developer" }
    }
  ],
  "status": "ok",
  "pagination": { "page": 1, "pages": 1, "count": 4, "limit": 10, "next": null, "prev": null }
}
```

> The success message literally reads `"The support request return correctly"` — a grammar
> slip in the controller code, quoted verbatim since it's part of the real response contract.

### `GET /api/v1/support_requests/:id` — show

Includes the ordered `comments` association (each comment excludes `author_email` and
`updated_at`, includes `team_member.name`):

```json
{
  "message": "Support request was found",
  "data": {
    "id": 5,
    "title": "Login page throws 500 error",
    "status": "open",
    "priority": "high",
    "overdue": false,
    "team_member": { "active": true, "email": "...", "name": "...", "role": "developer" },
    "comments": [
      { "id": 1, "body": "Comment #1 for '...'.", "support_request_id": 5, "created_at": "...", "team_member": { "name": "Abigail Galzin" } }
    ]
  },
  "status": "ok"
}
```

Errors: `404 { "error": "not found support request" }` if `:id` doesn't exist.

### `POST /api/v1/support_requests` — create

Body:

```json
{ "support_request": { "title": "...", "description": "...", "status": "open", "priority": "high", "due_date": "2026-08-01", "team_member_id": 5 } }
```

Permitted params: `title`, `description`, `status`, `priority`, `due_date`, `completed_at`,
`team_member_id`.

- `status` defaults to `"open"`, `priority` to `"medium"` if omitted.
- `team_member_id` may be omitted/`null` (unassigned); if present it must belong to an
  **active** team member.

| Outcome | Status | Body |
|---|---|---|
| Success | `201` | `{ message: "The support request was created", data: {...}, status: "created" }` |
| Missing/inactive team member | `404` | `{ error: "not found the team member" }` |
| Validation failure (e.g. blank title, invalid enum value) | `422` | `{ error: ["Title can't be blank", ...] }` |
| Missing `support_request` wrapper key | `400` | Rails default `ParameterMissing` handling |

### `PATCH/PUT /api/v1/support_requests/:id` — update

Same body/param shape as create. Additional business-rule failures:

| Outcome | Status | Body |
|---|---|---|
| `:id` not found | `404` | `{ error: "not found support request" }` |
| Reassigning to missing/inactive team member | `404` | `{ error: "not found the team member" }` |
| Editing a request whose current `status` is `closed` | `422` | `{ error: ["closed requests cannot be edited"] }` |
| Changing `status` from `resolved` to `closed` | `422` | `{ error: ["Status cannot change from resolved to closed"] }` |
| Other validation failure | `422` | `{ error: [...full_messages] }` |
| Success | `200` | `{ message: "The support request was updated", data: {...}, status: "ok" }` |

---

## Team Members

### `GET /api/v1/team_members` — list

Query params: `active` (boolean-ish string, blank = no filter), `role` (blank/`"undefined"`/`"null"` = no filter), `name` (case-insensitive partial match). Always paginated at a fixed `limit: 10` (no client override, unlike support requests).

```json
{
  "message": "Team members returned correctly",
  "data": [
    { "id": 1, "name": "Abigail Galzin", "email": "...", "role": "developer", "active": true,
      "support_requests": [ { "title": "...", "status": "open", "priority": "high" } ] }
  ],
  "status": "ok",
  "pagination": { "page": 1, "pages": 1, "count": 4, "limit": 10, "next": null, "prev": null }
}
```

Message comes from the shared I18n key `success.response: "%{model} returned correctly"`
(`config/locales/en.yml`), interpolated with `TeamMember.model_name.human.pluralize` for
`index` (→ "Team members") and `TeamMember.model_name.human` for `show`/`create`/`update`
(→ "Team member").

### `GET /api/v1/team_members/:id` — show

Same shape as a single list item, message `"Team member returned correctly"`. `404 { "error": "Team member not found" }` if missing.

### `POST /api/v1/team_members` — create

Body: `{ "team_member": { "name": "...", "email": "...", "role": "developer", "active": true } }`.

| Outcome | Status |
|---|---|
| Success | `201` |
| Validation failure (blank name, invalid email format, duplicate email, invalid role, invalid active) | `422`, `{ errors: [...full_messages] }` |

### `PATCH/PUT /api/v1/team_members/:id` — update

Same body shape. Notable failure modes:

| Outcome | Status | Body |
|---|---|---|
| `:id` not found | `404` | `{ error: "Team member not found" }` |
| Reactivating (`active: false → true`) | `422` | `{ errors: ["Active cannot be reactivated once deactivated"] }` |
| Other validation failure | `422` | `{ errors: [...] }` |
| Success (including `active: true → false` deactivation) | `200` | |

---

## Comments

### `POST /api/v1/support_requests/:support_request_id/comments` — create

Body: `{ "comment": { "body": "at least 10 characters", "author_email": "abigail.galzin@assuresoft.com" } }`.

- `author_email` must belong to an **active** team member — unlike support requests, a blank
  `author_email` is *not* special-cased as "no author"; it simply fails the existence check.

| Outcome | Status | Body |
|---|---|---|
| Support request not found | `404` | `{ error: "not found support request" }` |
| Author email missing/unknown/inactive | `404` | `{ error: "not found the team member" }` |
| `body` blank or shorter than 10 chars | `422` | `{ error: ["Body can't be blank"] }` / `{ error: ["Body is too short (minimum is 10 characters)"] }` |
| Success | `201` | `{ message: "The comment was created", data: { id, body, support_request_id, created_at, team_member: { name } }, status: "created" }` (note: `author_email`/`updated_at` excluded from the response) |

There is no `GET` for comments in isolation — they are only ever visible nested inside a
support request's `show` response.

---

## Dashboard

### `GET /api/v1/dashboard` — aggregate stats

No params. Not paginated (not a list of records).

```json
{
  "message": "Dashboard stats returned correctly",
  "data": {
    "total_requests": 4,
    "overdue_requests": 0,
    "unassigned_requests": 0,
    "requests_by_status":   { "open": 1, "in_progress": 1, "resolved": 2, "closed": 0 },
    "requests_by_priority": { "low": 1, "medium": 1, "high": 2, "critical": 0 }
  },
  "status": "ok"
}
```

`requests_by_status`/`requests_by_priority` always include **all four keys**, even at zero
(`SupportRequest.statuses.keys.index_with(0).merge(...)`), so the frontend never has to
special-case a missing bucket.

---

## Health check

`GET /up` → `rails/health#show` (Rails' built-in health check, not namespaced under
`/api/v1`). Used by uptime monitors/Kamal, not by the frontend.

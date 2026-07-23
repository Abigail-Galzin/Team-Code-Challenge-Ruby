# Architecture Decisions

## Backend Architecture Decisions

### Why Rails API

The backend is a Rails app generated with `config.api_only = true` (`backend/config/application.rb`), which strips out the middleware, view layer, and asset pipeline that a full Rails app carries (sessions, flash, cookies, ERB rendering) and keeps only what a JSON API needs. SupportFlow's backend exists to serve data to the React frontend, not to render HTML, so Active Record, routing, and controllers are worth keeping while the view stack is not. Rails also brings migrations, validations, and a mature testing ecosystem (RSpec, FactoryBot, Faker are already in the `Gemfile`) that let the team move quickly on CRUD-heavy domain models like `TeamMember` without hand-rolling that infrastructure.

### Why React (Decoupled Frontend)

The frontend (`frontend/`) is a separate Vite + React + TypeScript application that talks to the Rails API over HTTP, rather than server-rendered views. This keeps the two concerns independently deployable and testable, lets the frontend team iterate on UI/UX without touching Ruby, and matches the internal-tool shape of SupportFlow (a dashboard-style SPA). See the **Frontend Architecture Decisions** section below for the frontend-specific rationale (Vite, React Router, Axios, component architecture).

### Why REST API + React Instead of Rails View Templates

Rails can render HTML server-side out of the box (ERB/Jbuilder views, engines, Turbo/Hotwire), but this project deliberately drops that layer in favor of a Rails API backend paired with a standalone React SPA. Reasons:

- **Separation of concerns / independent iteration**: UI work (layout, components, styling, client-side validation — see the Frontend Architecture Decisions section below) doesn't require touching Ruby, and API work doesn't require touching TypeScript. Two people can work the stack in parallel without stepping on the same files, which matters for a team project like this one.
- **No server round-trip for every interaction**: SupportFlow is an interactive dashboard (filtering, sorting, forms, live status changes). A traditional Rails-rendered view re-renders full HTML pages per request unless layered with Turbo/Stimulus; a SPA fetching JSON keeps interactions client-side and only hits the network for data.
- **Reusable API surface**: A JSON API isn't tied to one consumer. The same endpoints this Rails app exposes could serve a future mobile client, a CLI, or another internal tool, whereas ERB views are coupled to being rendered and consumed as HTML by a browser.
- **Simpler backend footprint**: `config.api_only = true` already strips sessions, cookies, flash, and the asset pipeline (see "Why Rails API" above). Going back to server-rendered views would mean re-adding that middleware and the templating/asset toolchain (Sprockets/Propshaft, Turbo, view helpers) purely to duplicate what React already does better on the client — `jbuilder` is even commented out in the `Gemfile` since responses are plain JSON, not view-rendered.
- **Team fit**: the brief and existing `frontend/` scaffold (Vite + React + TypeScript, mock data wired for future Axios calls) already assume a decoupled frontend; keeping Rails as a pure API avoids a mismatched, half-adopted Hotwire setup fighting against a parallel React app.

The trade-off — an extra HTTP hop and the need to solve CORS and auth token handling across two apps instead of one — is accepted because it's outweighed by the above for a project with a dedicated frontend team and SPA-style UX requirements.

### Why PostgreSQL (vs. SQLite / MySQL)

`pg` is the only database adapter in the `Gemfile`, and `config/database.yml` is configured with `adapter: postgresql` across all environments.

- **vs. SQLite** (Rails 8's new default): SQLite is a single embedded file, not a client-server database — it's a poor fit for a multi-developer team project meant to run against a real, network-accessible database in every environment (local Docker, CI, production). It also struggles with concurrent writers (the whole database file locks on write), which matters once multiple API instances or background workers (Solid Queue, Solid Cable) hit the same database. Postgres also supports native enum-backed columns and case-insensitive unique constraints out of the box — already used by `TeamMember#role` and `TeamMember#email` — that SQLite has to fake with `CHECK` constraints or application-level validation alone.
- **vs. MySQL**: both are viable client-server RDBMSes, but Postgres was preferred for its stricter standards compliance and richer type system (native `enum`/`array`/`jsonb` types, partial and expression indexes, full `CHECK` constraint support) that Active Record and this domain model can lean on as it grows — e.g. status/priority fields on future support-request models. Postgres also has first-class, mature support in the Rails ecosystem (it's what Rails core and most guides default to) and in Kamal-based Docker deployments, avoiding subtle collation/encoding gotchas MySQL is more prone to (e.g. case-insensitive `utf8` string comparisons by default, historically weaker `CHECK` constraint enforcement before 8.0.16).
- **Net result**: Postgres gives the domain model room to grow into features SQLite handles poorly at this scale (enum columns, case-insensitive uniqueness, concurrent writes from multiple API instances) while avoiding MySQL's rougher edges around strictness and type fidelity, at the cost of requiring an actual running database service in every environment — solved locally via `docker-compose.yml` below.

Local Postgres is provisioned via `backend/docker-compose.yml` (a `postgres:16-alpine` container with a health check and named volume), so a developer only needs Docker and `docker compose up` to get a working database — no local Postgres install required. Connection settings are read from environment variables (`DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`) with `backend/.env.example` documenting the defaults that match the Compose service.

### Why Solid Queue / Solid Cache / Solid Cable

The `solid_cache`, `solid_queue`, and `solid_cable` gems (Rails 8 defaults) back caching, background jobs, and Action Cable with database-backed adapters instead of requiring a separate Redis instance. For this project's scale, one fewer moving part in local dev and deployment outweighs the throughput ceiling of a dedicated Redis/Sidekiq setup, and the app can migrate to Redis-backed adapters later without changing application code if that ceiling is ever reached.

### Environment Configuration

`dotenv-rails` loads `.env` in development/test so database credentials and other environment-specific config stay out of source control while `.env.example` documents the required variables for a new clone. This mirrors the frontend's approach of keeping environment-specific values (like the API base URL) outside committed code.

#### Per-Environment Database Variables

`config/database.yml` uses distinct, suffixed environment variables per Rails environment instead of one shared set, so that development, test, and production can point at different hosts/credentials without one environment's `.env` value accidentally leaking into another:

- **`development`**: `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` (defaults: `localhost` / `5432` / `postgres` / `postgres`) — matches the local `docker-compose.yml` Postgres service.
- **`test`**: `DATABASE_TEST_HOST`, `DATABASE_TEST_PORT`, `DATABASE_TEST_USERNAME`, `DATABASE_TEST_PASSWORD`, with the same literal defaults as development so the test suite works out of the box against the same local Postgres, but can be pointed elsewhere (e.g. a CI service container) without touching development config.
- **`production`**: `DATABASE_PROD_HOST`, `DATABASE_PROD_PORT`, `DATABASE_PROD_USERNAME`, `DATABASE_PROD_PASSWORD` — deliberately **no literal fallback** for host/password, so a misconfigured deploy fails fast instead of silently trying `localhost`/a default password against a production database.

All four are documented with placeholder values in `backend/.env.example`.

### Deployment Target

`kamal` and `thruster` are included in the `Gemfile` for Docker-based deployment (`backend/Dockerfile`, `backend/.kamal`), keeping the deployment story consistent with the local Docker Compose setup used for Postgres in development.

### Future Extensibility

- **CORS**: `rack-cors` is present but commented out in the `Gemfile`; it becomes a small, localized change once the frontend needs to call the API from a different origin.
- **Authentication**: `bcrypt` is present but commented out, ready for `has_secure_password` once auth is scoped.
- **Domain models**: `TeamMember` establishes the validation/enum patterns (see `backend/app/models/team_member.rb`) that subsequent models (support requests, assignments) are expected to follow.

## Frontend Architecture Decisions

### Why Vite

Vite gives fast cold starts and near-instant HMR via native ES modules in dev, and produces optimized static assets for production without hand-rolled bundler configuration. For a foundation-stage project that will grow incrementally, its low ceremony and predictable defaults matter more than the flexibility of a hand-tuned Webpack setup.

### Why React Router

`react-router-dom` is the de-facto standard for client-side routing in React and covers everything this stage needs — nested layouts, dynamic segments (`/requests/:id`), and programmatic navigation — without pulling in a full framework (e.g. Next.js) that would impose server-rendering concerns this internal tool doesn't need yet.

### Why Axios

An `axios` instance (`src/services/apiClient.ts`) is pre-configured with a base URL and timeout so that wiring up the real backend later is a matter of writing request functions, not introducing a new dependency or refactoring call sites. It is not called anywhere yet — all views read from `src/services/mockData.ts`.

### Folder Organization

Code is split along two axes:

- **`components/`** — reusable, business-logic-free UI grouped by role (`common`, `layout`, `form`, `data`, `feedback`). This mirrors how a design system is usually consumed: you reach for a category, not a single flat list.
- **`views/`** — one folder per route/page, colocating a page's `.tsx` and `.css`. Pages compose components; they do not define new low-level UI.

`services/`, `types/`, and `utils/` are kept thin and framework-agnostic so they can be extended (real API calls, richer domain types) without touching the component layer.

### Reusable Components

Every component in `components/` is typed, stateless with respect to business logic, and driven entirely by props — none of them import from `services/` or `views/`. This is what makes the `/components` Components Demo page possible: each one can be exercised in isolation with fake data, the same way a future contributor would use it inside a real page.

`TableGrid` in particular is written without any external table/grid library, since the spec explicitly avoids third-party UI dependencies; column definitions (`header`, `field`, `align`, `width`, `formatter`) are the only contract between a page and the table.

### Mobile-First Approach

Base styles target the smallest viewport; `PageContainer` padding and the `Grid` component's column counts step up via `min-width` media queries (`--spacing-md` on mobile, `--spacing-lg` at tablet, `--spacing-xl` at desktop). This avoids the common pitfall of designing for desktop and retrofitting mobile overrides.

### Design Decisions

Colors, spacing, radii, shadows, and typography are centralized as CSS custom properties in `src/styles/variables.css`. Components reference these variables exclusively rather than hardcoding values, so a future rebrand or dark theme is a one-file change. An 8px spacing scale and a small (6–8px) border radius keep the interface visually calm and consistent with enterprise tools like Jira or Azure DevOps, per the brief.

### Why No UI Framework

Material UI, Bootstrap, Tailwind, and Ant Design were intentionally excluded. Beyond the brief's explicit requirement, avoiding a UI framework at this stage keeps the component contracts (props, CSS classes) fully owned by this codebase — nothing to eject from, no framework-specific theming API to fight later when authentication, real data, and role-based UI states are layered in.

### Future Extensibility

- **Authentication/Authorization**: `AppLayout` and `Navbar` are the natural insertion points for a user menu or route guards; routes are already centralized in `router/AppRouter.tsx`, so wrapping protected routes is a small, localized change.
- **API integration**: `services/apiClient.ts` already exists; replacing `services/mockData.ts` calls with axios calls inside the same file keeps view components untouched.
- **State management**: Views currently use local `useState`. Because pages only consume data through `services/`, introducing a store (e.g. React Query, Zustand) later means changing the data layer, not every component that renders it.
- **Role-based access**: `types/support.ts` and the mock team members already model distinct people/roles, so gating UI by role is additive once auth exists.

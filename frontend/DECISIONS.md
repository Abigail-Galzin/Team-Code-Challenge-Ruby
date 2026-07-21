# Architecture Decisions

## Why Vite

Vite gives fast cold starts and near-instant HMR via native ES modules in dev, and produces optimized static assets for production without hand-rolled bundler configuration. For a foundation-stage project that will grow incrementally, its low ceremony and predictable defaults matter more than the flexibility of a hand-tuned Webpack setup.

## Why React Router

`react-router-dom` is the de-facto standard for client-side routing in React and covers everything this stage needs — nested layouts, dynamic segments (`/requests/:id`), and programmatic navigation — without pulling in a full framework (e.g. Next.js) that would impose server-rendering concerns this internal tool doesn't need yet.

## Why Axios

An `axios` instance (`src/services/apiClient.ts`) is pre-configured with a base URL and timeout so that wiring up the real backend later is a matter of writing request functions, not introducing a new dependency or refactoring call sites. It is not called anywhere yet — all views read from `src/services/mockData.ts`.

## Folder Organization

Code is split along two axes:

- **`components/`** — reusable, business-logic-free UI grouped by role (`common`, `layout`, `form`, `data`, `feedback`). This mirrors how a design system is usually consumed: you reach for a category, not a single flat list.
- **`views/`** — one folder per route/page, colocating a page's `.tsx` and `.css`. Pages compose components; they do not define new low-level UI.

`services/`, `types/`, and `utils/` are kept thin and framework-agnostic so they can be extended (real API calls, richer domain types) without touching the component layer.

## Reusable Components

Every component in `components/` is typed, stateless with respect to business logic, and driven entirely by props — none of them import from `services/` or `views/`. This is what makes the `/components` Components Demo page possible: each one can be exercised in isolation with fake data, the same way a future contributor would use it inside a real page.

`TableGrid` in particular is written without any external table/grid library, since the spec explicitly avoids third-party UI dependencies; column definitions (`header`, `field`, `align`, `width`, `formatter`) are the only contract between a page and the table.

## Mobile-First Approach

Base styles target the smallest viewport; `PageContainer` padding and the `Grid` component's column counts step up via `min-width` media queries (`--spacing-md` on mobile, `--spacing-lg` at tablet, `--spacing-xl` at desktop). This avoids the common pitfall of designing for desktop and retrofitting mobile overrides.

## Design Decisions

Colors, spacing, radii, shadows, and typography are centralized as CSS custom properties in `src/styles/variables.css`. Components reference these variables exclusively rather than hardcoding values, so a future rebrand or dark theme is a one-file change. An 8px spacing scale and a small (6–8px) border radius keep the interface visually calm and consistent with enterprise tools like Jira or Azure DevOps, per the brief.

## Why No UI Framework

Material UI, Bootstrap, Tailwind, and Ant Design were intentionally excluded. Beyond the brief's explicit requirement, avoiding a UI framework at this stage keeps the component contracts (props, CSS classes) fully owned by this codebase — nothing to eject from, no framework-specific theming API to fight later when authentication, real data, and role-based UI states are layered in.

## Future Extensibility

- **Authentication/Authorization**: `AppLayout` and `Navbar` are the natural insertion points for a user menu or route guards; routes are already centralized in `router/AppRouter.tsx`, so wrapping protected routes is a small, localized change.
- **API integration**: `services/apiClient.ts` already exists; replacing `services/mockData.ts` calls with axios calls inside the same file keeps view components untouched.
- **State management**: Views currently use local `useState`. Because pages only consume data through `services/`, introducing a store (e.g. React Query, Zustand) later means changing the data layer, not every component that renders it.
- **Role-based access**: `types/support.ts` and the mock team members already model distinct people/roles, so gating UI by role is additive once auth exists.

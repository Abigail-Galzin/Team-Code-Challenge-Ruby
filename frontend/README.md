# SupportFlow — Frontend

Internal enterprise application for registering, assigning, prioritizing, and tracking technical support requests.

This package contains **only the frontend foundation**: routing, layout, a lightweight component library, and static pages backed by mock data. There is no authentication, no backend integration, and no state management library — those are intentionally left for a later stage.

## Technology Stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/) (build tool and dev server)
- [TypeScript](https://www.typescriptlang.org/)
- [react-router-dom](https://reactrouter.com/) for client-side routing
- [axios](https://axios-http.com/) for a pre-configured HTTP client (not yet wired to a real API)

Plain CSS only — no Material UI, Bootstrap, Tailwind, or Ant Design.

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

The app starts on `http://localhost:5173`.

Other scripts:

```bash
npm run build    # type-check and produce a production build in dist/
npm run preview  # preview the production build locally
npm run lint     # run oxlint
```

## Folder Structure

```
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/     # Button, Badge, Chip, Avatar, Divider
│   │   ├── layout/     # Navbar, Header, Breadcrumb, PageContainer, Card, AppLayout
│   │   ├── form/        # TextBox, TextArea, Dropdown, Checkbox, RadioButton, Switch
│   │   ├── data/        # TableGrid, Pagination, Grid
│   │   └── feedback/    # Alert, EmptyState, ErrorState, LoadingSpinner, ConfirmationDialog
│   ├── views/
│   │   ├── Dashboard/
│   │   ├── SupportRequestList/
│   │   ├── RequestForm/
│   │   ├── RequestDetails/
│   │   ├── TeamMembers/
│   │   └── ComponentsDemo/
│   ├── hooks/
│   ├── router/
│   ├── services/        # mock data + axios client
│   ├── types/
│   ├── utils/
│   ├── styles/           # CSS variables, base styles, utility classes
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── README.md
├── DECISIONS.md
└── package.json
```

## Routes

| Path                 | Page                 |
| --------------------- | --------------------- |
| `/`                    | Dashboard              |
| `/requests`            | Support Request List   |
| `/requests/new`        | Create Request          |
| `/requests/:id`        | Request Details         |
| `/requests/:id/edit`   | Edit Request             |
| `/team-members`        | Team Members             |
| `/components`          | Components Demo           |

## Component Library Overview

A lightweight, Material-Design-inspired component library implemented entirely in plain CSS, organized by category under `src/components/`:

- **Layout** — `Navbar`, `Header`, `Breadcrumb`, `PageContainer`, `Card`, `AppLayout` (composes the four into the page shell used by every view).
- **Form** — `TextBox` (text/email/password/number with validation states), `TextArea`, `Dropdown`, `Checkbox`, `RadioButton`, `Switch`.
- **Common** — `Button` (primary/secondary/danger/loading), `Badge` (plus `StatusBadge` and `PriorityBadge` helpers), `Chip`, `Avatar`, `Divider`.
- **Data** — `TableGrid` (sticky header, hover rows, loading/error/empty states, optional zebra striping), `Pagination`, `Grid` (1/2/3-column responsive layout).
- **Feedback** — `Alert`, `EmptyState`, `ErrorState`, `LoadingSpinner`, `ConfirmationDialog`.

Every component is documented with a live example, current value, and event output on the **Components Demo** page (`/components`), which acts as an internal Storybook-style catalog.

See [DECISIONS.md](./DECISIONS.md) for the reasoning behind these choices.

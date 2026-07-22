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
| -------------------- | -------------------- |
| `/`                  | Dashboard            |
| `/requests`          | Support Request List |
| `/requests/new`      | Create Request       |
| `/requests/:id`      | Request Details      |
| `/requests/:id/edit` | Edit Request         |
| `/team-members`      | Team Members         |
| `/components`        | Components Demo      |

## Component Library

A lightweight, Material-Design-inspired component library implemented entirely in plain CSS, organized by category under `src/components/`. Every component is typed, presentational (no business logic or API calls), and documented with a live example, current value, and event output on the **Components Demo** page (`/components`), which acts as an internal Storybook-style catalog — check it first when you want to see a component in action before reading its props here.

Import components directly from their file, e.g. `import { Button } from "../../components/common/Button"`.

### Layout — `src/components/layout/`

Page structure. Most views don't touch these directly except `AppLayout` and `Card` — `Navbar`, `Header`, `Breadcrumb`, and `PageContainer` are composed together by `AppLayout`.

| Component       | Props                                                                                                                  | What it does                                                                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppLayout`     | `title: string`, `description?: string`, `breadcrumbs: BreadcrumbItem[]`, `actions?: ReactNode`, `children: ReactNode` | The standard page shell: `Navbar` + `Breadcrumb` + `Header` + your `children` + footer, centered inside `PageContainer`. Wrap every view's content in this. |
| `Navbar`        | _(none)_                                                                                                               | Sticky top bar with the SupportFlow brand and links to the 4 top-level routes; highlights the active route. Rendered once, inside `AppLayout`.              |
| `Header`        | `title: string`, `description?: string`, `actions?: ReactNode`                                                         | Page title + optional description, with an optional right-aligned slot for buttons (e.g. "New Request").                                                    |
| `Breadcrumb`    | `items: BreadcrumbItem[]` (`{ label: string; to?: string }`)                                                           | Upper-left breadcrumb trail. Every item except the last renders as a link (if it has `to`); the last renders as plain text (current page).                  |
| `PageContainer` | `children: ReactNode`                                                                                                  | Centers content with a 1200px max-width and mobile-first responsive padding.                                                                                |
| `Card`          | `title?: string`, `children: ReactNode`, `className?: string`                                                          | White surface, thin border, soft shadow, internal padding. General-purpose content container.                                                               |

```tsx
<AppLayout
  title="Dashboard"
  description="Overview of support activity"
  breadcrumbs={[{ label: "Dashboard" }]}
  actions={<Button onClick={handleNew}>New Request</Button>}
>
  <Card title="Recent Activity">...</Card>
</AppLayout>
```

### Form — `src/components/form/`

Controlled inputs. All of them are controlled (no internal state) — pass `value`/`checked` and handle `onChange` yourself.

| Component     | Props                                                                                                                                                                                                                                                  | What it does                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `TextBox`     | `label: string`, `type?: "text" \| "email" \| "password" \| "number"` (default `"text"`), `helperText?: string`, `error?: string`, `onChange?: (value: string) => void`, plus native input attrs (`required`, `disabled`, `placeholder`, `value`, ...) | Single-line input. Pass `error` to show a validation message and switch to the error border style instead of `helperText`. |
| `TextArea`    | `label: string`, `rows?: number` (default `4`), `helperText?: string`, `error?: string`, `onChange?: (value: string) => void`, plus native textarea attrs                                                                                              | Multi-line input, same error/helper behavior as `TextBox`.                                                                 |
| `Dropdown`    | `label: string`, `options: SelectOption[]` (`{ label, value }`), `value?: string`, `placeholder?: string`, `required?: boolean`, `disabled?: boolean`, `error?: string`, `helperText?: string`, `onChange?: (value: string) => void`                   | Native `<select>` styled to match the design system.                                                                       |
| `Checkbox`    | `label: string`, `checked: boolean`, `disabled?: boolean`, `onChange?: (checked: boolean) => void`                                                                                                                                                     | Single checkbox with label.                                                                                                |
| `RadioButton` | `label: string`, `name: string`, `options: SelectOption[]`, `value: string`, `onChange?: (value: string) => void`                                                                                                                                      | A labeled group of radios sharing `name`; renders all `options` at once.                                                   |
| `Switch`      | `label: string`, `checked: boolean`, `disabled?: boolean`, `onChange?: (checked: boolean) => void`                                                                                                                                                     | Toggle switch, same on/off contract as `Checkbox`.                                                                         |

```tsx
<TextBox
  label="Email"
  type="email"
  required
  value={email}
  onChange={setEmail}
  error={emailError}
  helperText="We'll never share your email"
/>

<Dropdown
  label="Priority"
  options={[{ label: "Low", value: "low" }, { label: "High", value: "high" }]}
  value={priority}
  onChange={setPriority}
  required
/>
```

### Common — `src/components/common/`

Small, generic building blocks used everywhere.

| Component | Props                                                                                                                                                                                      | What it does                                                                                                                                                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`  | `variant?: "primary" \| "secondary" \| "danger"` (default `"primary"`), `loading?: boolean`, `disabled?: boolean`, `onClick?: () => void`, `children: ReactNode`, plus native button attrs | `loading` shows a spinner and disables the button.                                                                                                                                                                                                                     |
| `Badge`   | `label: string`, `tone?: "neutral" \| "info" \| "primary" \| "warning" \| "success" \| "error"` (default `"neutral"`)                                                                      | Small rounded status pill. Also exports **`StatusBadge({ status })`** and **`PriorityBadge({ priority })`** — use these instead of a raw `Badge` when displaying a `SupportRequest`'s status/priority, since they already map each value to the right label and color. |
| `Chip`    | `label: string`, `onRemove?: () => void`                                                                                                                                                   | Tag-style pill; shows a remove (×) button only when `onRemove` is passed.                                                                                                                                                                                              |
| `Avatar`  | `name: string`, `size?: "sm" \| "md" \| "lg"` (default `"md"`)                                                                                                                             | Circular initials avatar, derives up to 2 initials from `name`.                                                                                                                                                                                                        |
| `Divider` | `spacing?: "sm" \| "md" \| "lg"` (default `"md"`)                                                                                                                                          | Horizontal rule with consistent vertical margin.                                                                                                                                                                                                                       |

```tsx
<StatusBadge status="in_progress" />
<PriorityBadge priority="high" />
<Button variant="danger" loading={isDeleting} onClick={handleDelete}>Delete</Button>
```

### Data — `src/components/data/`

For displaying collections.

| Component      | Props                                                                                                                                                                                                                                 | What it does                                                                                                                                                                                                                                                                                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `TableGrid<T>` | `columns: TableColumn<T>[]`, `rows: T[]`, `loading?: boolean`, `error?: string`, `emptyMessage?: string`, `zebra?: boolean`, `onRowClick?: (row: T) => void`, `onRetry?: () => void`, `getRowKey?: (row: T, index: number) => string` | Sticky header, hover rows, optional zebra striping. When `loading`/`error`/empty `rows` apply, it renders `LoadingSpinner`/`ErrorState`/`EmptyState` in place of the table automatically — you don't need to branch on those states yourself. `TableColumn` supports `header`, `field`, `align`, `width`, and a `formatter(row)` for custom cell content (e.g. rendering a `StatusBadge`). |
| `Pagination`   | `currentPage: number`, `totalPages: number`, `onPageChange: (page: number) => void`                                                                                                                                                   | Previous/Next buttons with a "Page X of Y" label; buttons auto-disable at the first/last page.                                                                                                                                                                                                                                                                                             |
| `Grid`         | `columns?: 1 \| 2 \| 3` (default `2`), `children: ReactNode`                                                                                                                                                                          | Responsive CSS grid (collapses to 1 column on small screens); typically wraps a list of `Card`s.                                                                                                                                                                                                                                                                                           |

```tsx
<TableGrid
  columns={[
    { header: "ID", field: "id", width: "100px" },
    { header: "Title", field: "title" },
    {
      header: "Status",
      field: "status",
      formatter: (row) => <StatusBadge status={row.status} />,
    },
  ]}
  rows={requests}
  loading={isLoading}
  error={error}
  onRowClick={(row) => navigate(`/requests/${row.id}`)}
/>
```

### Feedback — `src/components/feedback/`

States and confirmations. `TableGrid` already uses `LoadingSpinner`/`ErrorState`/`EmptyState` internally — use these directly only outside of a table context (e.g. on a detail page).

| Component            | Props                                                                                                                                                                          | What it does                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Alert`              | `variant: "success" \| "warning" \| "error" \| "info"`, `title?: string`, `children: ReactNode`                                                                                | Inline banner with left border + icon, for page-level or form-level messages.                                                                           |
| `EmptyState`         | `title: string`, `description?: string`, `action?: ReactNode`                                                                                                                  | "Nothing here yet" placeholder, optionally with a call-to-action (e.g. a "Create Request" button).                                                      |
| `ErrorState`         | `title?: string`, `description?: string`, `onRetry?: () => void`                                                                                                               | Error placeholder; shows a Retry button when `onRetry` is passed.                                                                                       |
| `LoadingSpinner`     | `label?: string` (default `"Loading..."`)                                                                                                                                      | Simple centered spinner with a text label.                                                                                                              |
| `ConfirmationDialog` | `open: boolean`, `title: string`, `description?: string`, `confirmLabel?: string`, `cancelLabel?: string`, `danger?: boolean`, `onConfirm: () => void`, `onCancel: () => void` | Modal overlay; clicking the backdrop calls `onCancel`. Set `danger` to render the confirm button in the danger variant (e.g. for delete confirmations). |

```tsx
<ConfirmationDialog
  open={isConfirmOpen}
  title="Delete this request?"
  description="This action cannot be undone."
  danger
  onConfirm={handleDelete}
  onCancel={() => setConfirmOpen(false)}
/>
```

See [DECISIONS.md](./DECISIONS.md) for the reasoning behind these choices.

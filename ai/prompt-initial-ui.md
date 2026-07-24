# SupportFlow Frontend Bootstrap

You are a Senior Frontend Architect and React + TypeScript developer.

Your task is to initialize the frontend of a project called **SupportFlow**.

---

# Project Objective

SupportFlow is an internal enterprise application for registering, assigning, prioritizing, and tracking technical support requests.

At this stage, build only the frontend foundation.

Do NOT implement:

- Authentication
- Authorization
- Backend integration
- Real API calls
- Business logic
- State management libraries (Redux, Zustand, MobX, etc.)

Use fake/mock data where necessary.

The project should compile successfully after:

```
npm install
npm run dev
```

without requiring additional modifications.

---

# Technology Stack

Initialize the project using:

- React
- Vite
- TypeScript

Install only:

- react-router-dom
- axios

Do not install additional libraries unless strictly necessary.

---

# Folder Structure

Use the following folder structure.

```
frontend/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── form/
│   │   ├── data/
│   │   └── feedback/
│   │
│   ├── views/
│   │   ├── Dashboard/
│   │   ├── SupportRequestList/
│   │   ├── RequestForm/
│   │   ├── RequestDetails/
│   │   ├── TeamMembers/
│   │   └── ComponentsDemo/
│   │
│   ├── hooks/
│   ├── router/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── styles/
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── README.md
├── DECISIONS.md
└── package.json
```

---

# Routing

Configure React Router.

Create the following routes.

```
/

Dashboard

/requests

Support Request List

/requests/new

Create Request

/requests/:id

Request Details

/requests/:id/edit

Edit Request

/team-members

Team Members

/components

Components Demo
```

---

# Application Layout

Create a reusable layout.

Every page must use the same layout.

Layout structure:

```
Navbar

↓

Header

↓

Breadcrumb

↓

Centered Content

↓

Footer (optional)
```

Navbar

- Sticky
- Height 64px
- SupportFlow project name
- Navigation links
- Active page indicator

Header

Contains:

- Page title
- Optional description

Breadcrumb

Always aligned to the upper-left.

Main Content

Centered horizontally.

```
max-width: 1200px
```

Padding:

- Mobile: 16px
- Tablet: 24px
- Desktop: 32px

Mobile-first responsive design.

---

# Pages

Create blank pages for:

Dashboard

Support Request List

Create / Edit Request

Request Details

Team Members

Each page should contain:

- Page title
- Short description
- Empty content section

---

# Components Demo

Create an independent page named:

Components Demo

This page acts as the internal component catalog similar to Storybook.

Every component should demonstrate:

- Live example
- Current value
- Event output
- Validation example
- Loading example
- Error example

Use fake data only.

---

# Reusable Components

Create a lightweight reusable component library.

Every component must:

- Use TypeScript
- Be reusable
- Be responsive
- Be independent from business logic
- Receive typed props

---

## Layout Components

Create:

- Navbar
- Header
- Breadcrumb
- PageContainer
- Card

---

## Inputs

Create:

TextBox

Supports:

- text
- email
- password
- number

Properties:

- label
- placeholder
- value
- required
- disabled
- helperText
- error

Validation examples:

- required
- email
- number

Display validation messages.

---

TextArea

Properties:

- label
- rows
- required
- helperText

---

Dropdown

Properties:

- label
- options
- placeholder
- required
- disabled

Use fake data.

Expose onChange event.

---

Checkbox

---

Radio Button

---

Switch

---

# Actions

Button

Variants:

- Primary
- Secondary
- Danger
- Disabled
- Loading

Expose onClick event.

---

# Display Components

Create:

Badge

Examples:

Open

Assigned

In Progress

Resolved

Closed

Low

Medium

High

Different colors for each status.

---

Chip

---

Avatar

Simple initials only.

---

Divider

---

Card

---

Empty State

---

Loading Spinner

---

Error State

Include:

- icon
- title
- description
- Retry button

---

Alert

Variants:

Success

Warning

Error

Info

---

Confirmation Dialog

Simple reusable modal.

---

# Table Grid

Create a reusable TableGrid component.

Do NOT use external libraries.

Features:

- Responsive
- Sticky header
- Hover row
- Empty state
- Loading state
- Error state
- Optional zebra rows

Props:

- columns
- rows
- loading
- error
- emptyMessage
- onRowClick

Columns support:

- header
- field
- align
- width
- formatter

Example data:

| ID | Title | Priority | Status | Assigned To | Created | Actions |

Populate using fake records.

Use Badge inside Status and Priority.

Actions column:

- View
- Edit
- Delete

Buttons only log to console.

---

# Pagination

Create a reusable Pagination component.

Include:

Previous

Next

Current page

Total pages

Use fake values.

---

# Grid Layout

Create a reusable Grid component.

Demonstrate:

- 1 column
- 2 columns
- 3 columns

Use Cards inside.

---

# Components Demo Sections

Create sections for:

1. Buttons

2. Text Inputs

3. Text Area

4. Dropdown

5. Checkbox

6. Radio Buttons

7. Switch

8. Alerts

9. Badges

10. Cards

11. Grid Layout

12. Table Grid

13. Pagination

14. Loading

15. Empty State

16. Error State

17. Confirmation Dialog

Each section should display:

- Component
- Description
- Current Value
- Event Output

---

# Styling

Follow a Material Design inspired design language without using Material UI or any other UI framework.

Do NOT use:

- Material UI
- Bootstrap
- Tailwind CSS
- Ant Design

Use plain CSS only.

Create a lightweight internal design system.

Use CSS variables.

Example variables:

```
--primary-color
--primary-dark
--secondary-color
--success-color
--warning-color
--error-color
--background-color
--surface-color
--border-color
--text-primary
--text-secondary
--shadow-small
--shadow-medium
--border-radius
--spacing-xs
--spacing-sm
--spacing-md
--spacing-lg
```

Suggested colors:

Primary

#1976D2

Secondary

#455A64

Background

#F5F7FA

Surface

#FFFFFF

Border

#E0E0E0

Text

#212121

Secondary Text

#616161

Use:

- 8px spacing system
- Roboto or Inter font
- Rounded corners (6–8px)
- Soft shadows
- Responsive typography
- Smooth transitions (150–250ms)
- Clean cards
- Professional forms
- Accessible color contrast

The design should resemble modern enterprise systems such as:

- Jira
- Azure DevOps
- ServiceNow
- Microsoft 365 Admin Center

Avoid flashy colors and excessive animations.

Keep the UI clean, professional, and functional.

---

# Documentation

Create README.md

Include:

- Project description
- Technology stack
- Installation
- Run locally
- Folder structure
- Routes
- Component library overview

Create DECISIONS.md

Explain:

- Why Vite
- Why React Router
- Why Axios
- Folder organization
- Reusable components
- Mobile-first approach
- Design decisions
- Why no UI framework
- Future extensibility

---

# UI / UX Requirements (Override)

The UI must be **extremely simple, clean, and minimal**, similar to a freshly installed Material UI or Bootstrap application before any customization.

---

# Design Principles

## Prioritize

- Simplicity over visual richness
- Functionality over aesthetics
- Enterprise appearance
- Clean spacing
- Consistent alignment
- Easy future customization

## Avoid

- Fancy effects
- Complex gradients
- Glassmorphism
- Excessive shadows
- Heavy borders
- Decorative elements
- Colorful interfaces
- Unnecessary animations

The application should resemble an **internal business tool**.

---

# Visual Style

## Colors

Use:

- White cards
- Light gray background
- Simple borders
- Very subtle shadows
- Small border radius (`6px`)
- Neutral color palette

## Typography

Use a clean, modern sans-serif font such as:

- Inter
- Roboto

Typography should follow proportions similar to Material UI defaults:

- Medium-weight titles
- Normal-weight body text
- Consistent spacing

---

# Components

All components should resemble the default appearance of Material UI or Bootstrap, **implemented using plain CSS only**.

## Buttons

- Flat appearance
- Small border radius
- Solid primary color
- Simple hover effect
- No elevation or lift animation

## Inputs

- White background
- Light gray border
- Blue focus border
- Consistent height
- Clean labels

## Cards

- White background
- Thin border
- Very soft shadow
- Internal padding only

## Tables

- Clean header
- Thin separators
- Simple hover state
- No alternating row colors unless explicitly enabled

## Navbar

- Solid white background
- Bottom border
- No gradients
- Simple navigation links
- Active link highlighted with the primary color

## Header

- Simple page title
- Small descriptive text below

## Breadcrumb

- Small typography
- Gray separators

## Alerts

- Minimal colored background
- Left border or subtle icon
- No heavy styling

## Dialogs

- White modal
- Simple overlay
- Standard action buttons

## Badges

- Small rounded pills
- Soft colors
- Minimal padding

## Pagination

- Simple Previous / Next buttons
- Current page indicator only

---

# CSS Guidelines

Use **plain CSS only**.

## Recommendations

- Create reusable CSS variables
- Keep styles modular
- Avoid excessively long CSS files
- Prefer reusable utility classes
- Keep selectors simple and maintainable

---

# Overall Goal

When opening the application, it should immediately feel similar to:

- Material UI default examples
- Bootstrap default examples
- Microsoft Admin portals
- Azure DevOps
- Jira

without copying their components.

The interface should feel:

- Lightweight
- Professional
- Intentionally understated

---

# Guiding Principle

> If there is any doubt between adding more design or keeping it simple, always choose the simpler solution.

---

Generate production-ready code with a clean architecture that can easily support future features such as authentication, API integration, state management, and role-based access without requiring major refactoring.

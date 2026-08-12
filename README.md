# AI Planner Assistant

A personal planning app for organizing life around **Life Areas → Goals → Tasks**, with an AI chat assistant, a calendar view, and a task backlog. Built with React, TypeScript, and MUI.

Live demo: `https://cebanoleksandr.github.io/ai-planner-assistant-fe/`

## Features

- **Dashboard** — overview of goals and tasks, with quick-create actions.
- **Life Areas** — group goals under areas (e.g. Health, Career, Finance), each with a color tag.
- **Goals** — linked to a Life Area, with a target date and status.
- **Task Backlog** — tasks linked to goals, with due dates and an AI Insights panel.
- **Calendar** — month/week view of tasks and events (via `react-big-calendar`).
- **AI Chat Assistant** — floating chat widget for asking the assistant to help plan/manage items.
- **Auth** — login/registration flow guarding the app routes.
- Responsive layout, including mobile-adapted popups and chat.

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) — dev server & build
- [MUI](https://mui.com/) — component library
- [Tailwind CSS](https://tailwindcss.com/) — utility classes (used alongside MUI's `sx`)
- [Redux Toolkit](https://redux-toolkit.js.org/) — global UI state (e.g. alerts)
- [TanStack Query](https://tanstack.com/query) — server state / data fetching
- [React Router](https://reactrouter.com/) — routing
- [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup) — forms & validation
- [react-big-calendar](https://github.com/jquense/react-big-calendar) — calendar view
- [Framer Motion](https://www.framer.com/motion/) — animations (popups, chat widget)
- [i18next](https://www.i18next.com/) — internationalization
- [Axios](https://axios-http.com/) — HTTP client

## Getting Started

### Prerequisites

- Node.js 18+
- A running instance of the backend API this app talks to

### Install

```bash
npm install
```

### Environment variables

Create a `.env` file in the project root with the backend API URL:

```
VITE_BASE_URL=http://localhost:3000
```

### Run in development

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview a production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Deploy

Publishes the built `dist` folder to GitHub Pages:

```bash
npm run deploy
```

## Project Structure

```
src/
  components/
    business/    # feature components (e.g. chat widget)
    layouts/      # app shell: Header, Sidebar, MainLayout
    popups/        # create/update/delete dialogs (Areas, Goals, Tasks, Logout)
    UI/            # shared UI primitives (e.g. alerts)
  pages/         # route-level pages (Dashboard, Calendar, Areas, Goals, Tasks, Auth)
  reactQuery/     # TanStack Query hooks per resource
  router/        # route definitions / guards
  services/      # API clients
  storage/       # Redux store & slices
  constants/     # shared constants (e.g. sidebar menu items)
```

## Domain Model

```
Life Area ─┬─ Goal ─┬─ Task
           │        └─ Task
           └─ Goal ──── Task
```

Life Areas are the top-level grouping; each Goal belongs to one Life Area and has a target date; each Task belongs to one Goal and has a due date.

# Expense Manager

A simple personal expense tracker built with the MERN stack (MongoDB,
Express, React, Node.js) to learn how a full-stack JavaScript app fits
together.

## What it does

- Add expenses with an amount, description, and category.
- The **backend** decides whether each category is a "Need" or a "Want" —
  you never choose this yourself, and the frontend can't override it.
- Set your monthly income and see it split using the 50/30/20 rule
  (50% Needs, 30% Wants, 20% Savings target).
- Toggle between Today / This Week / This Month to see spending for that
  period.
- Get a warning banner if this month's "Want" spending goes over 30% of
  your income.
- Get a simple, rule-based (no AI) flag on expenses that are unusually
  large compared to your past spending in that category.

## Project layout

```
client/   React app (Vite) — everything the user sees
server/   Express API — all business logic and the database connection
```

See `expense_manager_architecture.md` for the full design notes (data
models, API design, classification rules, etc).

## Prerequisites

- Node.js (v18+)
- MongoDB running locally on the default port (`mongodb://localhost:27017`).
  On Windows, if you installed MongoDB Community Server, it runs
  automatically as the "MongoDB" Windows service.

## Running the app

You need **two terminals** — one for the backend, one for the frontend.

**Terminal 1 — backend:**

```bash
cd server
npm install    # first time only
npm run dev
```

This starts the API at `http://localhost:5000`. Visit
`http://localhost:5000/api/health` in a browser — you should see
`{"status":"ok"}`.

**Terminal 2 — frontend:**

```bash
cd client
npm install    # first time only
npm run dev
```

This starts the app at `http://localhost:5173`. Open that URL in your
browser to use the app.

## Backend environment variables (`server/.env`)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-manager
```

## API summary

| Method | Endpoint                        | Purpose                                |
| ------ | -------------------------------- | --------------------------------------- |
| GET    | `/api/income`                   | Get current monthly income              |
| PUT    | `/api/income`                   | Set/update monthly income               |
| GET    | `/api/categories`                | List categories with their Need/Want type |
| POST   | `/api/expenses`                 | Create an expense                       |
| GET    | `/api/expenses?period=`          | List expenses (`today`/`week`/`month`, or all) |
| DELETE | `/api/expenses/:id`              | Delete an expense                       |
| GET    | `/api/dashboard?period=`         | Dashboard totals, budget, warning flag  |

## Where things live (backend)

- `server/models/` — Mongoose schemas (`User`, `Expense`)
- `server/services/categoryService.js` — the one place that maps a
  category to "need" or "want"
- `server/services/unusualExpenseService.js` — the "is this expense
  unusually large?" rule
- `server/utils/dateUtils.js` — the one place that defines what "Today",
  "This Week" (Mon–Sun), and "This Month" mean
- `server/controllers/` — request handling + validation for each resource
- `server/routes/` — maps URLs to controller functions

## Where things live (frontend)

- `client/src/services/api.js` — every call to the backend goes through
  here
- `client/src/components/Dashboard.jsx` — the main page; fetches data and
  passes it down to the other components
- `client/src/components/` — one file per piece of UI (income form,
  expense form, spending summary, budget summary, warning banner,
  expense list)

# Expense Management Web Application — MERN Architecture

## 1. Project Overview

A simple personal expense management web application built with the MERN stack:

- **MongoDB** — database
- **Express.js** — backend API framework
- **React** — frontend
- **Node.js** — backend runtime

The application allows a user to:

- Enter and manage monthly income.
- Add an expense with amount, description, and a category selected from a dropdown.
- Automatically classify the expense as a **Need** or **Want** based on the selected category.
- View spending for **Today**, **This Week**, and **This Month**.
- Track spending against a basic **50/30/20** budget rule.
- Detect and highlight potentially unusual expenses.
- Show a warning banner when Want spending exceeds 30% of monthly income.

The first version should intentionally avoid unnecessary complexity such as AI classification, multi-user collaboration, or advanced financial analytics.

---

## 2. Functional Requirements

### 2.1 Income

The user can:

- Enter monthly income.
- View the current monthly income.
- Update the income later.

The income remains unchanged until the user explicitly updates it.

For V1, use the current monthly income for the current month's 50/30/20 calculations.

### 2.2 Expense Entry

The user enters:

- Amount
- Description
- Category

The user selects the category from a dropdown.

The application determines Need/Want classification from the category. The user does **not** manually select Need or Want.

Example:

```text
Category: Groceries      -> Need
Category: Rent          -> Need
Category: Healthcare    -> Need
Category: Restaurant    -> Want
Category: Entertainment -> Want
Category: Shopping      -> Want
```

The application also automatically stores the expense date/time.

### 2.3 Spending Periods

The dashboard supports three views:

```text
Today | This Week | This Month
```

The selected view shows total spending for that period and a breakdown of Needs and Wants.

For V1, define a week as **Monday through Sunday**.

### 2.4 50/30/20 Rule

Given monthly income:

```text
Needs   = 50% of income
Wants   = 30% of income
Savings = 20% of income
```

Example:

```text
Income = ₹50,000

Needs limit   = ₹25,000
Wants limit   = ₹15,000
Savings target = ₹10,000
```

Savings is a target, not an expense category.

### 2.5 Wants Warning

Show a warning banner when:

```text
current month Want spending > 30% of monthly income
```

Suggested message:

> You have spent more than 30% of your income on wants.

The warning should disappear when the condition is no longer true.

### 2.6 Unusual Expense Detection

V1 should use a simple rule-based approach rather than AI.

Suggested rule:

- Only detect unusual expenses when at least 3 previous expenses exist in the same category.
- Calculate the historical average for that category.
- Mark a new expense as unusual when:

```text
new expense > 2 × historical category average
```

An unusual expense is a warning, not an error. The expense should still be saved.

---

# 3. High-Level Architecture

```text
                    ┌─────────────────────┐
                    │      React App      │
                    │      Frontend       │
                    └──────────┬──────────┘
                               │
                         HTTP / REST API
                               │
                    ┌──────────▼──────────┐
                    │   Express + Node    │
                    │      Backend       │
                    └──────────┬──────────┘
                               │
              ┌────────────────┴────────────────┐
              │                                 │
      Business / Service Logic             API Routes
              │                                 │
              └────────────────┬────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │      MongoDB        │
                    │      Database       │
                    └─────────────────────┘
```

## Architectural principle

Keep calculations and business rules primarily on the backend so that the frontend focuses on displaying data and collecting user input.

Examples of backend responsibilities:

- Determine Need/Want from category.
- Calculate spending periods.
- Calculate 50/30/20 limits.
- Determine whether the Want threshold has been exceeded.
- Detect unusual expenses.

---

# 4. Recommended Project Structure

```text
expense-manager/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── IncomeForm.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   ├── SpendingSummary.jsx
│   │   │   ├── BudgetSummary.jsx
│   │   │   ├── WarningBanner.jsx
│   │   │   └── ExpenseList.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles/
│   │       └── app.css
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Expense.js
│   │
│   ├── routes/
│   │   ├── incomeRoutes.js
│   │   ├── expenseRoutes.js
│   │   └── dashboardRoutes.js
│   │
│   ├── controllers/
│   │   ├── incomeController.js
│   │   ├── expenseController.js
│   │   └── dashboardController.js
│   │
│   ├── services/
│   │   ├── categoryService.js
│   │   └── unusualExpenseService.js
│   │
│   ├── utils/
│   │   └── dateUtils.js
│   │
│   ├── server.js
│   └── package.json
│
├── .env
├── .gitignore
├── README.md
└── package.json
```

For V1, authentication is intentionally excluded. The architecture can be extended to support multiple users later.

---

# 5. Database Design

## 5.1 User Document

```javascript
{
  _id: ObjectId,
  name: String,
  monthlyIncome: Number,
  createdAt: Date,
  updatedAt: Date
}
```

Example:

```json
{
  "name": "User",
  "monthlyIncome": 50000
}
```

## 5.2 Expense Document

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  amount: Number,
  description: String,
  category: String,
  type: "need" | "want",
  isUnusual: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

Example:

```json
{
  "amount": 750,
  "description": "Dinner",
  "category": "Restaurant",
  "type": "want",
  "isUnusual": false
}
```

The `type` field is generated by the backend from the selected category.

---

# 6. Category Configuration

Use a single backend category configuration for V1 so classification remains deterministic.

Example:

```javascript
const categories = {
  rent: "need",
  groceries: "need",
  utilities: "need",
  transportation: "need",
  healthcare: "need",
  education: "need",
  insurance: "need",
  restaurant: "want",
  entertainment: "want",
  shopping: "want",
  gaming: "want",
  hobbies: "want",
  movies: "want",
  travel: "want"
};
```

The frontend dropdown should use the same set of categories.

Do not allow the client to submit an arbitrary `type`. The backend must derive it from the category.

---

# 7. API Design

## Income

### Get income

```http
GET /api/income
```

### Update income

```http
PUT /api/income
```

Request:

```json
{
  "monthlyIncome": 50000
}
```

---

## Expenses

### Create expense

```http
POST /api/expenses
```

Request:

```json
{
  "amount": 500,
  "description": "Dinner",
  "category": "Restaurant"
}
```

Backend processing:

```text
category
   ↓
categoryService
   ↓
Need / Want
   ↓
unusualExpenseService
   ↓
save expense
```

### Get expenses

```http
GET /api/expenses
```

Optional query parameter:

```http
GET /api/expenses?period=today
GET /api/expenses?period=week
GET /api/expenses?period=month
```

### Delete expense

```http
DELETE /api/expenses/:id
```

Deletion is useful because users may make an accidental entry.

---

## Dashboard

```http
GET /api/dashboard?period=month
```

Suggested response:

```json
{
  "income": 50000,
  "period": "month",
  "spending": {
    "total": 18750,
    "needs": 12000,
    "wants": 6750
  },
  "budget": {
    "needsLimit": 25000,
    "wantsLimit": 15000,
    "savingsTarget": 10000
  },
  "wantsLimitExceeded": false
}
```

---

# 8. Frontend Responsibilities

## Dashboard

The dashboard should contain:

1. Monthly income
2. Want warning banner
3. Today / Week / Month toggle
4. Total spending
5. Needs spending
6. Wants spending
7. 50/30/20 budget summary
8. Expense list
9. Add Expense button/form
10. Update Income form

---

# 9. Frontend Component Responsibilities

### `Dashboard.jsx`

Main page that loads and displays dashboard information.

### `IncomeForm.jsx`

Allows the user to set/update monthly income.

### `ExpenseForm.jsx`

Inputs:

- Amount
- Description
- Category dropdown

It should not contain a Need/Want dropdown.

### `SpendingSummary.jsx`

Displays Today / Week / Month totals.

### `BudgetSummary.jsx`

Displays the 50/30/20 limits and current usage.

### `WarningBanner.jsx`

Displays the Wants warning when required.

### `ExpenseList.jsx`

Displays recent expenses including:

- Amount
- Description
- Category
- Need/Want
- Date
- Unusual indicator

---

# 10. Backend Service Responsibilities

## `categoryService.js`

Responsible for converting the selected category to a type.

Example:

```javascript
getCategoryType("Restaurant") // "want"
getCategoryType("Rent")       // "need"
```

If an unknown category is received, return a validation error rather than guessing.

## `unusualExpenseService.js`

Responsible for determining whether a newly added expense is unusual.

Suggested V1 algorithm:

```text
1. Find previous expenses in the same category.
2. If fewer than 3 exist, return false.
3. Calculate their average amount.
4. Compare the new amount against 2 × average.
5. If new amount is greater, return true.
```

## `dateUtils.js`

Responsible for calculating date ranges for:

- Today
- Current week (Monday-Sunday)
- Current month

Keep date calculations in one place so the same rules are used throughout the backend.

---

# 11. Validation Rules

### Income

- Must be a number.
- Must be greater than 0.
- Should support decimals up to two places.

### Expense

- Amount must be greater than 0.
- Amount should support decimals up to two places.
- Description cannot be empty.
- Category must be one of the predefined categories.
- Do not accept a client-provided Need/Want value.

---

# 12. Important Edge Cases

## No income

The application should still allow expenses to be recorded.

The dashboard should explain that 50/30/20 calculations are unavailable until income is entered.

## Income = 0

Reject it rather than allowing division-by-zero calculations.

## No expenses

Display zero totals instead of an error.

## New category with little history

Do not mark expenses unusual until at least 3 historical expenses exist in that category.

## Month change

An expense from September should not count toward October's monthly total.

## Week change

Define the week consistently as Monday-Sunday.

## Accidental expense

Support deleting an expense.

## Income changes

Changing current monthly income updates the current 50/30/20 thresholds.

## Time zones

Use a consistent timezone strategy so an expense near midnight is assigned to the correct day/week/month.

---

# 13. Security and Data Integrity for V1

Even without authentication, the backend should:

- Validate all incoming data.
- Never trust Need/Want classification from the client.
- Validate categories against the backend category list.
- Keep MongoDB credentials in environment variables.
- Keep API and database logic out of React components.

When authentication is added later, all User and Expense operations should be scoped to the authenticated user's ID.

---

# 14. Development Order

Build in this order:

### Phase 1 — Project setup

- Create React client.
- Create Node/Express server.
- Connect MongoDB.
- Configure environment variables.

### Phase 2 — Income

- Create User model.
- Implement get/update income endpoints.
- Build income UI.

### Phase 3 — Expenses

- Create Expense model.
- Build category dropdown.
- Implement create/list/delete expense endpoints.
- Automatically classify Need/Want on the backend.

### Phase 4 — Dashboard

- Implement Today/Week/Month calculations.
- Build dashboard summary.

### Phase 5 — 50/30/20

- Calculate Needs, Wants, and Savings limits.
- Display current spending versus limits.

### Phase 6 — Warnings

- Implement Want threshold warning.
- Implement unusual expense detection.

### Phase 7 — UI polish

- Improve layout.
- Add loading states.
- Add error states.
- Improve responsive behavior.

---

# 15. V1 Scope Boundaries

Do **not** add these in the initial implementation:

- Authentication / JWT
- AI expense classification
- Bank account integration
- Payment integrations
- Recurring expenses
- Multiple currencies
- Advanced charts
- Notifications
- Multi-user sharing

These can be future features after the core application is working.

---

# 16. Definition of Done for V1

The application is considered functional when a user can:

1. Enter monthly income.
2. Update monthly income.
3. Add an expense.
4. Select its category from a dropdown.
5. See the backend automatically classify the expense as Need or Want.
6. See the expense in the expense list.
7. Delete an expense.
8. Toggle between Today, This Week, and This Month.
9. See spending totals for the selected period.
10. See 50/30/20 limits based on income.
11. See a warning when Want spending exceeds 30% of income.
12. See unusual expenses highlighted when the V1 historical-average rule is satisfied.
13. Use the application without errors when there are no expenses or income has not yet been entered.

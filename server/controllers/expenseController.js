const Expense = require("../models/Expense");
const { getCategoryType, getAllCategories } = require("../services/categoryService");
const { getOrCreateUser } = require("../services/userService");
const { getPeriodRange } = require("../utils/dateUtils");
const { checkIsUnusual } = require("../services/unusualExpenseService");

// POST /api/expenses
async function createExpense(req, res) {
  const { amount, description, category } = req.body;

  if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "amount must be a number greater than 0" });
  }
  if (typeof description !== "string" || description.trim() === "") {
    return res.status(400).json({ error: "description cannot be empty" });
  }

  // The backend decides Need vs Want — an unknown category is rejected
  // rather than guessed, and any `type` sent by the client is ignored.
  const type = getCategoryType(category);
  if (!type) {
    return res.status(400).json({
      error: `category must be one of: ${getAllCategories().join(", ")}`,
    });
  }

  const user = await getOrCreateUser();
  const isUnusual = await checkIsUnusual(category, amount);

  const expense = await Expense.create({
    userId: user._id,
    amount,
    description: description.trim(),
    category,
    type,
    isUnusual,
  });

  res.status(201).json(expense);
}

// GET /api/expenses
// GET /api/expenses?period=today|week|month
async function getExpenses(req, res) {
  const { period } = req.query;
  let filter = {};

  if (period) {
    const range = getPeriodRange(period);
    if (!range) {
      return res.status(400).json({ error: "period must be one of: today, week, month" });
    }
    filter.createdAt = { $gte: range.start, $lte: range.end };
  }

  const expenses = await Expense.find(filter).sort({ createdAt: -1 });
  res.json(expenses);
}

// DELETE /api/expenses/:id
async function deleteExpense(req, res) {
  const expense = await Expense.findByIdAndDelete(req.params.id);
  if (!expense) {
    return res.status(404).json({ error: "expense not found" });
  }
  res.json({ message: "expense deleted" });
}

module.exports = { createExpense, getExpenses, deleteExpense };

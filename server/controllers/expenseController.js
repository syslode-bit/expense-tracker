const Expense = require("../models/Expense");
const { getCategoryType, getAllCategories } = require("../services/categoryService");
const { getOrCreateUser } = require("../services/userService");
const { getPeriodRange } = require("../utils/dateUtils");
const { checkIsUnusual } = require("../services/unusualExpenseService");
const asyncHandler = require("../utils/asyncHandler");

// POST /api/expenses
const createExpense = asyncHandler(async (req, res) => {
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

  const [user, isUnusual] = await Promise.all([
    getOrCreateUser(),
    checkIsUnusual(category, amount),
  ]);

  const expense = await Expense.create({
    userId: user._id,
    amount,
    description: description.trim(),
    category,
    type,
    isUnusual,
  });

  res.status(201).json(expense);
});

// GET /api/expenses
// GET /api/expenses?period=today|week|month
const getExpenses = asyncHandler(async (req, res) => {
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
});

// DELETE /api/expenses/:id
const deleteExpense = asyncHandler(async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: "invalid expense id" });
  }

  const expense = await Expense.findByIdAndDelete(req.params.id);
  if (!expense) {
    return res.status(404).json({ error: "expense not found" });
  }
  res.json({ message: "expense deleted" });
});

module.exports = { createExpense, getExpenses, deleteExpense };

const Expense = require("../models/Expense");

// Simple rule-based check (no AI): an expense is "unusual" if it's more
// than double the average of previous expenses in the same category —
// but only once there are at least 3 prior expenses to compare against.
async function checkIsUnusual(category, amount) {
  const previousExpenses = await Expense.find({ category });

  if (previousExpenses.length < 3) {
    return false;
  }

  const total = previousExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const average = total / previousExpenses.length;

  return amount > 2 * average;
}

module.exports = { checkIsUnusual };

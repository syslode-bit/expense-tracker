const Expense = require("../models/Expense");
const { getOrCreateUser } = require("../services/userService");
const { getPeriodRange, getThisMonthRange } = require("../utils/dateUtils");

// GET /api/dashboard?period=today|week|month (defaults to "month")
async function getDashboard(req, res) {
  const period = req.query.period || "month";
  const range = getPeriodRange(period);
  if (!range) {
    return res.status(400).json({ error: "period must be one of: today, week, month" });
  }

  const user = await getOrCreateUser();
  const income = user.monthlyIncome;

  const periodExpenses = await Expense.find({
    createdAt: { $gte: range.start, $lte: range.end },
  });

  const spending = periodExpenses.reduce(
    (totals, expense) => {
      totals.total += expense.amount;
      if (expense.type === "need") totals.needs += expense.amount;
      if (expense.type === "want") totals.wants += expense.amount;
      return totals;
    },
    { total: 0, needs: 0, wants: 0 }
  );

  // Budget limits and the Wants warning need an income to be set — without
  // one, we still return spending totals so the dashboard doesn't break.
  let budget = null;
  let wantsLimitExceeded = false;

  if (income) {
    budget = {
      needsLimit: income * 0.5,
      wantsLimit: income * 0.3,
      savingsTarget: income * 0.2,
    };

    // The Wants warning always looks at the CURRENT MONTH, regardless of
    // which period (today/week/month) the dashboard is currently showing.
    const monthRange = getThisMonthRange();
    const monthWantExpenses = await Expense.find({
      type: "want",
      createdAt: { $gte: monthRange.start, $lte: monthRange.end },
    });
    const monthWantsTotal = monthWantExpenses.reduce((sum, e) => sum + e.amount, 0);

    wantsLimitExceeded = monthWantsTotal > budget.wantsLimit;
  }

  res.json({
    income,
    incomeConfigured: income !== null,
    period,
    spending,
    budget,
    wantsLimitExceeded,
  });
}

module.exports = { getDashboard };

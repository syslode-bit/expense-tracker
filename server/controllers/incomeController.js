const { getOrCreateUser } = require("../services/userService");

// GET /api/income
async function getIncome(req, res) {
  const user = await getOrCreateUser();
  res.json({ monthlyIncome: user.monthlyIncome });
}

// PUT /api/income
async function updateIncome(req, res) {
  const { monthlyIncome } = req.body;

  if (typeof monthlyIncome !== "number" || Number.isNaN(monthlyIncome)) {
    return res.status(400).json({ error: "monthlyIncome must be a number" });
  }
  if (monthlyIncome <= 0) {
    return res.status(400).json({ error: "monthlyIncome must be greater than 0" });
  }

  const user = await getOrCreateUser();
  user.monthlyIncome = monthlyIncome;
  await user.save();

  res.json({ monthlyIncome: user.monthlyIncome });
}

module.exports = { getIncome, updateIncome };

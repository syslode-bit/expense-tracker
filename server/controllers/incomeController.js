const { getOrCreateUser } = require("../services/userService");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/income
const getIncome = asyncHandler(async (req, res) => {
  const user = await getOrCreateUser();
  res.json({ monthlyIncome: user.monthlyIncome });
});

// PUT /api/income
const updateIncome = asyncHandler(async (req, res) => {
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
});

module.exports = { getIncome, updateIncome };

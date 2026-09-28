const { getAllCategories, getCategoryType } = require("../services/categoryService");

// GET /api/categories
// Lets the frontend build its dropdown from the same list the backend
// uses for classification, instead of hardcoding categories twice.
function getCategories(req, res) {
  const categories = getAllCategories().map((name) => ({
    name,
    type: getCategoryType(name),
  }));
  res.json(categories);
}

module.exports = { getCategories };

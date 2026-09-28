// Single source of truth for category -> Need/Want classification.
// The frontend dropdown displays these same category names, but only the
// backend decides whether a category counts as a "need" or a "want" —
// the client can never override this.
const CATEGORY_TYPES = {
  Rent: "need",
  Groceries: "need",
  Utilities: "need",
  Transportation: "need",
  Healthcare: "need",
  Education: "need",
  Insurance: "need",

  Restaurants: "want",
  Shopping: "want",
  Entertainment: "want",
  Gaming: "want",
  Movies: "want",
  Hobbies: "want",
  Travel: "want",
};

// Returns "need" or "want" for a known category, or null if the category
// isn't recognized (callers should treat null as a validation error).
function getCategoryType(category) {
  return CATEGORY_TYPES[category] || null;
}

function getAllCategories() {
  return Object.keys(CATEGORY_TYPES);
}

module.exports = { getCategoryType, getAllCategories };

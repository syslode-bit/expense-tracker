// Purely decorative — maps each category to an emoji for the UI. This has
// no effect on Need/Want classification, which is decided by the backend.
const CATEGORY_ICONS = {
  Rent: "🏠",
  Groceries: "🛒",
  Utilities: "💡",
  Transportation: "🚗",
  Healthcare: "🏥",
  Education: "📚",
  Insurance: "🛡️",
  Restaurants: "🍽️",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Gaming: "🎮",
  Movies: "🎟️",
  Hobbies: "🎨",
  Travel: "✈️",
};

export function getCategoryIcon(category) {
  return CATEGORY_ICONS[category] || "💸";
}

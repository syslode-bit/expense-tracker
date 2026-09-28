// Single place that defines what "Today", "This Week", and "This Month"
// mean, so the expenses list and the dashboard always agree with each other.
// Ranges are calendar-based (not "last 24 hours" etc.) and use the
// server's local time zone.

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function getTodayRange() {
  const now = new Date();
  return { start: startOfDay(now), end: endOfDay(now) };
}

// Week runs Monday through Sunday.
function getThisWeekRange() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const monday = new Date(now);
  monday.setDate(now.getDate() - daysSinceMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { start: startOfDay(monday), end: endOfDay(sunday) };
}

function getThisMonthRange() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: startOfDay(firstDay), end: endOfDay(lastDay) };
}

// Returns { start, end } for a period keyword, or null if not recognized.
function getPeriodRange(period) {
  if (period === "today") return getTodayRange();
  if (period === "week") return getThisWeekRange();
  if (period === "month") return getThisMonthRange();
  return null;
}

module.exports = {
  getTodayRange,
  getThisWeekRange,
  getThisMonthRange,
  getPeriodRange,
};

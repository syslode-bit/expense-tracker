// Shared formatting helpers so amount/date display stays consistent
// across every component that shows an expense or a currency value.
export function formatCurrency(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatDateTime(isoString) {
  return new Date(isoString).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

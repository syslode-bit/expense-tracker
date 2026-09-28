function formatCurrency(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function SpendingSummary({ spending }) {
  return (
    <div className="spending-summary">
      <div className="summary-card">
        <h3>Total Spent</h3>
        <p>{formatCurrency(spending.total)}</p>
      </div>
      <div className="summary-card">
        <h3>Needs</h3>
        <p>{formatCurrency(spending.needs)}</p>
      </div>
      <div className="summary-card">
        <h3>Wants</h3>
        <p>{formatCurrency(spending.wants)}</p>
      </div>
    </div>
  );
}

export default SpendingSummary;

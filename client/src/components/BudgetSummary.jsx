function formatCurrency(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function BudgetRow({ label, spent, limit, colorName }) {
  const percent = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
  const over = spent > limit;

  return (
    <div className="budget-row">
      <div className="budget-row-top">
        <span className="budget-label">{label}</span>
        <span className={`budget-amounts ${over ? "over" : ""}`}>
          {formatCurrency(spent)} <span className="budget-of">/ {formatCurrency(limit)}</span>
        </span>
      </div>
      <div className="progress-track">
        <div
          className={`progress-fill progress-fill-${colorName}${over ? " over" : ""}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function BudgetSummary({ budget, incomeConfigured, spending }) {
  if (!incomeConfigured) {
    return (
      <div className="card budget-summary">
        <h2>50/30/20 Budget</h2>
        <p className="status-message">
          Set your monthly income above to see your budget breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="card budget-summary">
      <h2>50/30/20 Budget</h2>
      <BudgetRow label="Needs" spent={spending.needs} limit={budget.needsLimit} colorName="need" />
      <BudgetRow label="Wants" spent={spending.wants} limit={budget.wantsLimit} colorName="want" />
      <div className="savings-target">
        <span>🎯 Savings Target</span>
        <strong>{formatCurrency(budget.savingsTarget)}</strong>
      </div>
    </div>
  );
}

export default BudgetSummary;

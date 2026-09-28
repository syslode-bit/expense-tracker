function formatCurrency(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function BudgetSummary({ budget, incomeConfigured, spending }) {
  if (!incomeConfigured) {
    return (
      <div className="card">
        <h2>50/30/20 Budget</h2>
        <p className="status-message">
          Set your monthly income above to see your budget breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>50/30/20 Budget</h2>
      <div className="budget-row">
        <span>Needs</span>
        <span>
          {formatCurrency(spending.needs)} / {formatCurrency(budget.needsLimit)}
        </span>
      </div>
      <div className="budget-row">
        <span>Wants</span>
        <span>
          {formatCurrency(spending.wants)} / {formatCurrency(budget.wantsLimit)}
        </span>
      </div>
      <div className="budget-row">
        <span>Savings Target</span>
        <span>{formatCurrency(budget.savingsTarget)}</span>
      </div>
    </div>
  );
}

export default BudgetSummary;

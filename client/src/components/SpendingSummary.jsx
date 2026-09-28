import { formatCurrency } from "../utils/format";

function SpendingSummary({ spending }) {
  return (
    <div className="spending-summary">
      <div className="summary-card">
        <div className="summary-icon total">💵</div>
        <div>
          <h3>Total Spent</h3>
          <p>{formatCurrency(spending.total)}</p>
        </div>
      </div>
      <div className="summary-card">
        <div className="summary-icon need">📌</div>
        <div>
          <h3>Needs</h3>
          <p>{formatCurrency(spending.needs)}</p>
        </div>
      </div>
      <div className="summary-card">
        <div className="summary-icon want">✨</div>
        <div>
          <h3>Wants</h3>
          <p>{formatCurrency(spending.wants)}</p>
        </div>
      </div>
    </div>
  );
}

export default SpendingSummary;

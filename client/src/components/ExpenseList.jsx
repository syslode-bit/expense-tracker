import { deleteExpense } from "../services/api";
import { getCategoryIcon } from "../utils/categoryIcons";

function formatCurrency(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDateTime(isoString) {
  return new Date(isoString).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ExpenseList({ expenses, onExpenseDeleted }) {
  async function handleDelete(id) {
    await deleteExpense(id);
    onExpenseDeleted();
  }

  return (
    <div className="card expense-list">
      <h2>🧾 Recent Expenses</h2>

      {expenses.length === 0 ? (
        <p className="status-message">No expenses recorded yet.</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense._id} className={`expense-item expense-item-${expense.type}`}>
              <span className="expense-icon">{getCategoryIcon(expense.category)}</span>

              <div className="expense-main">
                <div className="expense-top-row">
                  <span className="expense-description">{expense.description}</span>
                  <span className="expense-amount">{formatCurrency(expense.amount)}</span>
                </div>
                <div className="expense-meta-row">
                  <span className={`expense-type-badge expense-type-${expense.type}`}>
                    {expense.type}
                  </span>
                  <span>{expense.category}</span>
                  <span>{formatDateTime(expense.createdAt)}</span>
                  {expense.isUnusual && <span className="expense-unusual">⚠️ Unusual</span>}
                </div>
              </div>

              <button
                className="icon-button"
                onClick={() => handleDelete(expense._id)}
                aria-label="Delete expense"
                title="Delete expense"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExpenseList;

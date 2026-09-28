import { deleteExpense } from "../services/api";

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
      <h2>Recent Expenses</h2>

      {expenses.length === 0 ? (
        <p className="status-message">No expenses recorded yet.</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense._id} className="expense-item">
              <span className="expense-amount">{formatCurrency(expense.amount)}</span>
              <span className="expense-description">{expense.description}</span>
              <span className="expense-category">{expense.category}</span>
              <span className={`expense-type expense-type-${expense.type}`}>
                {expense.type}
              </span>
              {expense.isUnusual && <span className="expense-unusual">⚠️ Unusual</span>}
              <span className="expense-category">{formatDateTime(expense.createdAt)}</span>
              <button className="secondary" onClick={() => handleDelete(expense._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExpenseList;

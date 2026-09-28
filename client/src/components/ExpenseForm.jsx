import { useState } from "react";
import { createExpense } from "../services/api";

function ExpenseForm({ categories, onExpenseAdded }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [lastAdded, setLastAdded] = useState(null);

  const needCategories = categories.filter((c) => c.type === "need");
  const wantCategories = categories.filter((c) => c.type === "want");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLastAdded(null);
    try {
      const expense = await createExpense({
        amount: Number(amount),
        description,
        category,
      });
      setAmount("");
      setDescription("");
      setCategory("");
      setLastAdded(expense);
      onExpenseAdded();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="card expense-form" onSubmit={handleSubmit}>
      <h2>Add Expense</h2>

      <label>
        Amount (₹)
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          required
        />
      </label>

      <label>
        Description
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>

      <label>
        Category
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="" disabled>
            Select a category
          </option>
          <optgroup label="Needs">
            {needCategories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Wants">
            {wantCategories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </optgroup>
        </select>
      </label>

      <button type="submit">Add Expense</button>

      {error && <p className="error-message">{error}</p>}
      {lastAdded?.isUnusual && (
        <p className="warning-message">
          ⚠️ That expense is unusually large compared to your past {lastAdded.category} spending.
        </p>
      )}
    </form>
  );
}

export default ExpenseForm;

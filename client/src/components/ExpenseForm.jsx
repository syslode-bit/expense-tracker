import { useState } from "react";
import { createExpense } from "../services/api";
import { getCategoryIcon } from "../utils/categoryIcons";

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
      <h2>➕ Add Expense</h2>

      <label>
        Description
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Dinner with friends"
          required
        />
      </label>

      <div className="form-row">
        <label>
          Amount (₹)
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
            placeholder="0.00"
            required
          />
        </label>

        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="" disabled>
              Select
            </option>
            <optgroup label="Needs">
              {needCategories.map((c) => (
                <option key={c.name} value={c.name}>
                  {getCategoryIcon(c.name)} {c.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Wants">
              {wantCategories.map((c) => (
                <option key={c.name} value={c.name}>
                  {getCategoryIcon(c.name)} {c.name}
                </option>
              ))}
            </optgroup>
          </select>
        </label>
      </div>

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

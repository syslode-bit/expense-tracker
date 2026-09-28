import { useState } from "react";
import { updateIncome } from "../services/api";

function IncomeForm({ income, onIncomeUpdated }) {
  const [editing, setEditing] = useState(income == null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await updateIncome(Number(value));
      setValue("");
      setEditing(false);
      onIncomeUpdated();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!editing) {
    return (
      <div className="card income-display">
        <span>Monthly Income: ₹{income.toLocaleString("en-IN")}</span>
        <button onClick={() => setEditing(true)}>Update</button>
      </div>
    );
  }

  return (
    <form className="card income-form" onSubmit={handleSubmit}>
      <label>
        Monthly Income (₹)
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          min="0.01"
          step="0.01"
          required
        />
      </label>
      <button type="submit">Save</button>
      {income != null && (
        <button
          type="button"
          className="secondary"
          onClick={() => setEditing(false)}
          style={{ marginLeft: 8 }}
        >
          Cancel
        </button>
      )}
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

export default IncomeForm;

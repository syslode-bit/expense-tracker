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

  return (
    <div className="hero-liquid">
      <span className="hero-eyebrow">💰 Expense Manager</span>

      {!editing ? (
        <>
          <h1 className="hero-headline">₹{income.toLocaleString("en-IN")}</h1>
          <p className="hero-sub">Your monthly income</p>
          <button className="pill-dark" onClick={() => setEditing(true)}>
            Update Income
          </button>
        </>
      ) : (
        <form className="hero-form" onSubmit={handleSubmit}>
          <p className="hero-sub">Set your monthly income (₹)</p>
          <input
            className="hero-input"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            min="0.01"
            step="0.01"
            placeholder="50,000"
            required
            autoFocus
          />
          <div className="hero-form-actions">
            <button type="submit" className="pill-dark">
              Save
            </button>
            {income != null && (
              <button type="button" className="pill-outline-dark" onClick={() => setEditing(false)}>
                Cancel
              </button>
            )}
          </div>
          {error && <p className="hero-error">{error}</p>}
        </form>
      )}
    </div>
  );
}

export default IncomeForm;

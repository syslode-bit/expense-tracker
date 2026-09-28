import { useCallback, useEffect, useState } from "react";
import { getCategories, getDashboard, getExpenses } from "../services/api";
import IncomeForm from "./IncomeForm";
import ExpenseForm from "./ExpenseForm";
import SpendingSummary from "./SpendingSummary";
import BudgetSummary from "./BudgetSummary";
import WarningBanner from "./WarningBanner";
import ExpenseList from "./ExpenseList";

const PERIODS = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

function Dashboard() {
  const [period, setPeriod] = useState("month");
  const [dashboard, setDashboard] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reloads everything the dashboard shows. Passed down so child forms
  // (income, add expense, delete expense) can trigger a refresh after
  // they change something on the server.
  const loadData = useCallback(async () => {
    try {
      setError("");
      const [dashboardData, expenseData] = await Promise.all([
        getDashboard(period),
        getExpenses(),
      ]);
      setDashboard(dashboardData);
      setExpenses(expenseData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [period]);

  // Categories rarely change, so they only need to load once.
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return <p className="status-message">Loading...</p>;
  }

  return (
    <div>
      <h1>Expense Manager</h1>

      {error && <p className="error-message">{error}</p>}

      <IncomeForm income={dashboard.income} onIncomeUpdated={loadData} />

      {dashboard.wantsLimitExceeded && <WarningBanner />}

      <div className="period-toggle">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            className={period === p.value ? "active" : ""}
            onClick={() => setPeriod(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <SpendingSummary spending={dashboard.spending} />

      <BudgetSummary
        budget={dashboard.budget}
        incomeConfigured={dashboard.incomeConfigured}
        spending={dashboard.spending}
      />

      <ExpenseForm categories={categories} onExpenseAdded={loadData} />

      <ExpenseList expenses={expenses} onExpenseDeleted={loadData} />
    </div>
  );
}

export default Dashboard;

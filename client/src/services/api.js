// All calls to our backend go through this file, so components never call
// fetch() directly. If the API base URL ever changes, this is the only
// place that needs updating.
//
// VITE_API_URL lets the deployed frontend point at wherever the backend
// actually lives, without hardcoding it. Locally, with no .env file, it
// falls back to the dev server on port 5000.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Turns a non-2xx response into a thrown Error with the server's message.
async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories`);
  return handleResponse(res);
}

export async function getIncome() {
  const res = await fetch(`${BASE_URL}/income`);
  return handleResponse(res);
}

export async function updateIncome(monthlyIncome) {
  const res = await fetch(`${BASE_URL}/income`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ monthlyIncome }),
  });
  return handleResponse(res);
}

export async function getExpenses(period) {
  const query = period ? `?period=${period}` : "";
  const res = await fetch(`${BASE_URL}/expenses${query}`);
  return handleResponse(res);
}

export async function createExpense(expense) {
  const res = await fetch(`${BASE_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  return handleResponse(res);
}

export async function deleteExpense(id) {
  const res = await fetch(`${BASE_URL}/expenses/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

export async function getDashboard(period) {
  const res = await fetch(`${BASE_URL}/dashboard?period=${period}`);
  return handleResponse(res);
}

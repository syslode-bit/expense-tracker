// Load variables from .env into process.env before anything else uses them
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Allow the React app (running on a different port) to call this API
app.use(cors());

// Parse incoming JSON request bodies into req.body
app.use(express.json());

// Simple route to confirm the server is alive and reachable
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/income", incomeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

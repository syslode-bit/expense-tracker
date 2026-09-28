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

// Catches requests to routes that don't exist
app.use((req, res) => {
  res.status(404).json({ error: "route not found" });
});

// Catches any error passed to next() by asyncHandler (see utils/asyncHandler.js).
// Without this, an error in a route handler would crash the whole server.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });

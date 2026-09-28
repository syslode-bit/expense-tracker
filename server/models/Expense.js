const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    // Derived by the backend from `category` — never trusted from the client.
    type: {
      type: String,
      enum: ["need", "want"],
      required: true,
    },
    // Set by unusualExpenseService when the expense is created. A warning
    // flag only — it never blocks saving the expense.
    isUnusual: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);

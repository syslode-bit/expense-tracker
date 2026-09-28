const mongoose = require("mongoose");

// V1 has no authentication, so there is only ever a single User document
// in this collection — it represents "the" user of the app.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "User",
    },
    monthlyIncome: {
      type: Number,
      default: null, // null means "income has not been set yet"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

const User = require("../models/User");

// V1 has no login system, so the app always operates on one shared user
// document. This helper finds it, or creates it the first time it's needed.
// Both the income and dashboard controllers rely on this.
async function getOrCreateUser() {
  let user = await User.findOne();
  if (!user) {
    user = await User.create({});
  }
  return user;
}

module.exports = { getOrCreateUser };

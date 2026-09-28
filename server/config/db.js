const mongoose = require("mongoose");
const dns = require("dns");

// On some networks (observed with Windows + certain ISP DNS servers),
// Node can't resolve the SRV record that Atlas connection strings
// (mongodb+srv://) depend on, even though the OS's own DNS lookup works
// fine. Pointing Node's resolver at a public DNS server fixes it. This is
// harmless for a local mongodb:// URI, which doesn't do a DNS SRV lookup.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Opens the connection to MongoDB using the URI from .env.
// Called once when the server starts (see server.js).
async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");
}

module.exports = connectDB;

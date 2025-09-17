const express = require("express");
const cors = require("cors");
const app = express();

// CORS setup
app.use(cors({
  origin: "https://islamic-guide-theta.vercel.app",
  methods: ["GET", "POST"],
  credentials: true
}));

// ✅ টেস্ট route
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong from backend" });
});

// আপনার অন্য route গুলো এখানে থাকবে

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

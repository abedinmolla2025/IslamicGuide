const express = require("express");
const cors = require("cors");

const app = express();

// CORS allow
app.use(cors({
  origin: "https://islamic-guide-theta.vercel.app"
}));

// test route
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong from backend" });
});

// port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

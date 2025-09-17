const express = require("express");
const cors = require("cors");
const app = express();

// এখানে বসাবেন 👇
app.use(cors({
  origin: "https://islamic-guide-theta.vercel.app"
}));

// Example route
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong from backend" });
});

app.listen(3000, () => {
  console.log("✅ Server running");
});
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong from backend" });
});

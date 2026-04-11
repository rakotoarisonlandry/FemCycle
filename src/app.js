const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// routes ici
app.get("/", (req, res) => {
  res.send("FemCycle API running");
});
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/cycles", require("./routes/cycleRoutes"));

module.exports = app;
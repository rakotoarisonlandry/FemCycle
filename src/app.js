const express = require("express");
const cors = require("cors");
const { default: rateLimit } = require("express-rate-limit");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/partner", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}), require("./routes/partnerRoutes"));

app.use("/api/v1/notifications",rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}), require("./routes/notificationRoutes"));

app.use(
  "/api/v1/logs",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
  require("./routes/logRoutes"),
);
// routes ici
app.get(
  "/",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
  (req, res) => {
    res.send("FemCycle API running");
  },
);
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);
app.use(
  "/api/v1/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
  require("./routes/authRoutes"),
);
app.use(
  "/api/v1/cycles",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
  require("./routes/cycleRoutes"),
);

module.exports = app;

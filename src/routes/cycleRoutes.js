const express = require("express");
const router = express.Router();
const Cycle = require("../models/Cycle");
const auth = require("../middlewares/authMiddleware");
const { calculateCycle } = require("../services/cycleService");

router.post("/", auth, async (req, res) => {
  const cycle = await Cycle.create({
    userId: req.user.id,
    startDate: req.body.startDate,
    cycleLength: req.body.cycleLength,
  });
  res.json(cycle);
});

router.get("/current", auth, async (req, res) => {
  const lastCycle = await Cycle.findOne({ userId: req.user.id }).sort({
    startDate: -1,
  });

  if (!lastCycle) return res.status(404).json({ msg: "No cycle found" });

  const result = calculateCycle(lastCycle.startDate, lastCycle.cycleLength);

  res.json(result);
});

router.get("/current/status", auth, async (req, res) => {
  const lastCycle = await Cycle.findOne({ userId: req.user.id }).sort({
    startDate: -1,
  });

  const result = calculateCycle(lastCycle.startDate, lastCycle.cycleLength);

  res.json({ status: result.status });
});

module.exports = router;

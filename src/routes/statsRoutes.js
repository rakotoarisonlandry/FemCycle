const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

const {
  getCycleAverage,
  getSymptomsStats,
  getAccuracy,
  getInsights
} = require("../controllers/statsController");

router.get("/cycle-average", auth, getCycleAverage);
router.get("/symptoms", auth, getSymptomsStats);
router.get("/accuracy", auth, getAccuracy);
router.get("/ai/insights", auth, getInsights);

module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

const {
  getSettings,
  updateSettings,
  getHistory,
  testNotification
} = require("../controllers/notificationController");

router.get("/settings", auth, getSettings);
router.put("/settings", auth, updateSettings);
router.get("/history", auth, getHistory);
router.post("/test", auth, testNotification);

module.exports = router;
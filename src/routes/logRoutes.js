const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

const {
  createLog,
  getLogs,
  getLogByDate,
  updateLog,
  deleteLog,
} = require("../controllers/logController");

router.post("/", auth, createLog);
router.get("/", auth, getLogs);
router.get("/:date", auth, getLogByDate);
router.put("/:id", auth, updateLog);
router.delete("/:id", auth, deleteLog);

module.exports = router;

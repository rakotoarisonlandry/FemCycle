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
const { body } = require("express-validator");

router.post("/", auth,body("pain").isInt({ min: 0, max: 10 }), createLog);
router.get("/", auth, getLogs);
router.get("/:date", auth, getLogByDate);
router.put("/:id", auth, updateLog);
router.delete("/:id", auth, deleteLog);

module.exports = router;

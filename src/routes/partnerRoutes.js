const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");

const {
  invitePartner,
  acceptInvite,
  getPartnerStatus,
  removePartner
} = require("../controllers/partnerController");

router.post("/invite", auth, invitePartner);
router.post("/accept", auth, acceptInvite);
router.get("/status", auth, getPartnerStatus);
router.delete("/", auth, removePartner);

module.exports = router;
const User = require("../models/User");
const crypto = require("crypto");
const { calculateCycle } = require("../services/cycleService");
const Cycle = require("../models/Cycle");

exports.invitePartner = async (req, res) => {
  const user = await User.findById(req.user.id);

  const token = crypto.randomBytes(32).toString("hex");

  user.partnerInviteToken = token;
  user.partnerInviteExpire = Date.now() + 24 * 60 * 60 * 1000;

  await user.save();

  res.json({
    inviteLink: `http://localhost:3000/accept-invite/${token}`
  });
};

exports.acceptInvite = async (req, res) => {
  const { token } = req.body;

  const inviter = await User.findOne({
    partnerInviteToken: token,
    partnerInviteExpire: { $gt: Date.now() }
  });

  if (!inviter) {
    return res.status(400).json({ msg: "Invalid or expired invite" });
  }

  const currentUser = await User.findById(req.user.id);

  // lien bidirectionnel
  inviter.partnerId = currentUser._id;
  currentUser.partnerId = inviter._id;

  inviter.partnerInviteToken = null;

  await inviter.save();
  await currentUser.save();

  res.json({ msg: "Partner linked successfully" });
};

exports.getPartnerStatus = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user.partnerId) {
    return res.status(404).json({ msg: "No partner linked" });
  }

  const partner = await User.findById(user.partnerId);

  const lastCycle = await Cycle.findOne({
    userId: partner._id
  }).sort({ startDate: -1 });

  if (!lastCycle) {
    return res.json({ msg: "No cycle data" });
  }

  const result = calculateCycle(
    lastCycle.startDate,
    lastCycle.cycleLength
  );

  res.json({
    status: result.status,
    phase: result.phase
  });
};

exports.removePartner = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user.partnerId) {
    return res.status(400).json({ msg: "No partner" });
  }

  const partner = await User.findById(user.partnerId);

  partner.partnerId = null;
  user.partnerId = null;

  await partner.save();
  await user.save();

  res.json({ msg: "Partner removed" });
};
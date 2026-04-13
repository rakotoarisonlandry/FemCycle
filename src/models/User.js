const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "L'email est requis"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: String,
  cycleLength: { type: Number, default: 28 },
  periodLength: { type: Number, default: 5 },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  refreshToken: String,
  resetToken: String,
  resetTokenExpire: Date,
  notificationSettings: {
    periodReminder: { type: Boolean, default: true },
    ovulationAlert: { type: Boolean, default: true },
    dailyReminder: { type: Boolean, default: false },
  },
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  partnerInviteToken: String,
  partnerInviteExpire: Date,
});

module.exports = mongoose.model("User", userSchema);

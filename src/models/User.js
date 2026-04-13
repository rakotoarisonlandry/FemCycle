const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
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
  dailyReminder: { type: Boolean, default: false }
}
});

module.exports = mongoose.model("User", userSchema);

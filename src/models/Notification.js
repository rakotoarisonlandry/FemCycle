const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  message: String,
  type: String, // PERIOD, OVULATION, ALERT
  date: Date,
  isRead: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
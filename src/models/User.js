const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  cycleLength: { type: Number, default: 28 },
  periodLength: { type: Number, default: 5 },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("User", userSchema);
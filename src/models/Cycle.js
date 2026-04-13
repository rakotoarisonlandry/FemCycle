const mongoose = require("mongoose");

const cycleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    startDate: Date,
    cycleLength: Number,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cycle", cycleSchema);

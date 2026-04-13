const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true },

    mood: { type: String },
    pain: { type: Number, min: 0, max: 10 },
    temperature: Number,
    discharge: String,
    libido: String,
    weight: Number,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Log", logSchema);

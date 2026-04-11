import { Schema, model } from "mongoose";

const cycleSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  startDate: Date,
  cycleLength: Number
}, { timestamps: true });

export default model("Cycle", cycleSchema);
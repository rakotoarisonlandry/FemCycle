import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: String,
  password: String,
  cycleLength: { type: Number, default: 28 },
  periodLength: { type: Number, default: 5 },
  partnerId: { type: Schema.Types.ObjectId, ref: "User" }
});

export default model("User", userSchema);
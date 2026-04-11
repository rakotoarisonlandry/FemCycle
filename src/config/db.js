import { connect } from "mongoose";

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("MongoDB connecté");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
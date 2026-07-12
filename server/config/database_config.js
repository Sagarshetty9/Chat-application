import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.info("Connected to Database ✅ ");
  } catch (error) {
    console.error("Connection to database failed ❌", error);
    process.exit(1);
  }
};

export default connectDB;

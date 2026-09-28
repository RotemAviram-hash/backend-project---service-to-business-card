import mongoose from "mongoose";
import printMessage from "../utils/printMessage.js";

const connectDB = async () => {
  try {
    const { default: config } = await import("config");

    const environment = config.util.getEnv("NODE_ENV");

    const mongoUri =
      environment === "atlas"
        ? process.env.MONGO_URI_ATLAS
        : config.get("mongoUri");

    const conn = await mongoose.connect(mongoUri);

    printMessage(`MongoDB Connected: ${conn.connection.host}`, "success");
  } catch (error) {
    printMessage(`Error: ${error.message}`, "error");
    process.exit(1);
  }
};

export default connectDB;

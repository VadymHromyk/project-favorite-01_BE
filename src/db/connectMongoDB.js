import mongoose from "mongoose";
import dns from "node:dns";

// Fix SRV DNS resolution for MongoDB Atlas
dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URI;

    if (!mongoUrl) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDB connection established successfully");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

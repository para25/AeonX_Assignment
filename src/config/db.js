// src/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Strict query off (as per latest Mongoose guidelines)
    mongoose.set("strictQuery", false);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // options not required in latest versions, kept minimal
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Handle graceful shutdown
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});

module.exports = connectDB;

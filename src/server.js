// src/server.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const routes = require("./routes");

// Initialize Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // JSON parser

// Load routes
app.use("/api", routes);

// Connect database
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

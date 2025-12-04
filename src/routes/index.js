// src/routes/index.js
const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const orderRoutes = require("./order.routes");

// health endpoint
router.get("/", (req, res) => res.json({ message: "API is working" }));

// mount auth routes under /api/auth
router.use("/auth", authRoutes);
router.use("/orders", orderRoutes);

module.exports = router;

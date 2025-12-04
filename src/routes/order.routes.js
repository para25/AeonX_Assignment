// src/routes/order.routes.js

const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrder,
  updateStatus,
  listOrders,
} = require("../controllers/order.controller");

const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

const validate = require("../middleware/validate.middleware");
const {
  createOrderSchema,
  updateStatusSchema,
} = require("../middleware/order.validation");


router.get("/", verifyToken, listOrders);

// Create order (User & Admin)
router.post("/", verifyToken, validate(createOrderSchema), createOrder);

// Get order by ID (owner or Admin)
router.get("/:id", verifyToken, getOrder);

// Update status (Admin only)
router.patch("/:id/status",
  verifyToken,
  authorizeRoles("Admin"),
  validate(updateStatusSchema),
  updateStatus
);

module.exports = router;

// src/controllers/order.controller.js

const Order = require("../models/order.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");
const { addEmailJob, addInvoiceJob } = require("../queues/order.queue");
const { getCache, setCache, deleteCache } = require("../utils/cache");   // <-- Added deleteCache



//  * POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const order = await Order.create({
      userId,
      items: req.body.items,
      shippingAddress: req.body.shippingAddress,
    });

    // Fetch user email
    const user = await User.findById(userId).select("email");

    // Trigger background jobs
    await addEmailJob(order, user.email);
    await addInvoiceJob(order);

    res.status(201).json({ data: order });
  } catch (err) {
    next(err);
  }
};



//  * GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;

    // 1. Check cache
    const cacheKey = `order:${orderId}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return res.json({ data: cachedData, cache: true });
    }

    // 2. Fetch from DB
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: { message: "Order not found" } });

    // RBAC check
    if (order.userId.toString() !== req.user.id.toString() && req.user.role !== "Admin") {
      return res.status(403).json({ error: { message: "Access denied" } });
    }

    // 3. Save in cache
    await setCache(cacheKey, order, 300); // TTL 5 minutes

    res.json({ data: order });
  } catch (err) {
    next(err);
  }
};



//  * PATCH /api/orders/:id/status
exports.updateStatus = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: { message: "Invalid order ID" } });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: { message: "Order not found" } });

    // Only admin can change status
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: { message: "Only Admin can change status" } });
    }

    order.status = status;
    await order.save();

    // 🚀 Clear cache for this order
    await deleteCache(`order:${orderId}`);

    res.json({ data: order });
  } catch (err) {
    next(err);
  }
};



//  * GET /api/orders?page=1&limit=10&status=Pending
exports.listOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = {};

    // Users can only see their own orders
    if (req.user.role === "User") {
      filters.userId = req.user.id;
    } else if (req.query.userId) {
      filters.userId = req.query.userId;
    }

    if (req.query.status) filters.status = req.query.status;

    if (req.query.from || req.query.to) {
      filters.createdAt = {};
      if (req.query.from) filters.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) filters.createdAt.$lte = new Date(req.query.to);
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filters),
    ]);

    res.json({
      data: orders,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

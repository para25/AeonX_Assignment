// src/models/order.model.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const shippingSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    items: {
      type: [itemSchema],
      required: true,
      validate: (val) => val.length > 0
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
      index: true
    },

    shippingAddress: {
      type: shippingSchema,
      required: true
    },

    invoiceUrl: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);


//  * Auto-calculate totalAmount using items array
orderSchema.pre("validate", function () {
  if (this.items && this.items.length > 0) {
    this.items.forEach((item) => {
      item.total = item.price * item.quantity;
    });

    this.totalAmount = this.items.reduce((sum, item) => sum + item.total, 0);
  }
});

// Index on createdAt for sorting + pagination
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

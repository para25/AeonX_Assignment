// src/middleware/order.validation.js

const Joi = require("joi");

// Validate create order
const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        itemId: Joi.string().required(),
        name: Joi.string().required(),
        price: Joi.number().min(0).required(),
        quantity: Joi.number().min(1).required(),
      })
    )
    .min(1)
    .required(),

  shippingAddress: Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string().allow("", null),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required(),
    postalCode: Joi.string().required(),
  }).required(),
});

// Validate status update
const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("Pending", "Shipped", "Delivered", "Cancelled")
    .required(),
});

module.exports = {
  createOrderSchema,
  updateStatusSchema,
};

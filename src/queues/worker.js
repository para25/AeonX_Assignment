// src/queues/worker.js
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const { Worker, redisConnection } = require("./bull.config");
const Order = require("../models/order.model");

//  * Worker for sending emails
new Worker(
  "emailQueue",
  async (job) => {
    const { orderId, email } = job.data;

    console.log("📧 Sending email for order:", orderId);

    // Simulate for email sending
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(`✅ Email sent to: ${email}`);
  },
  { connection: redisConnection }
);


//  * Worker for invoice generation

new Worker(
  "invoiceQueue",
  async (job) => {
    const { orderId, amount } = job.data;

    console.log("📄 Generating invoice for order:", orderId);

    // Simulate for PDF creation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const fakeUrl = `https://fake-invoices.com/invoice_${orderId}.pdf`;

    await Order.findByIdAndUpdate(orderId, { invoiceUrl: fakeUrl });

    console.log("✅ Invoice generated:", fakeUrl);
  },
  { connection: redisConnection }
);

console.log("👷 Worker is running...");

// src/queues/order.queue.js

const { Queue, redisConnection } = require("./bull.config");

// Queue names
const EMAIL_QUEUE = "emailQueue";
const INVOICE_QUEUE = "invoiceQueue";

// Create email queue
const emailQueue = new Queue(EMAIL_QUEUE, { connection: redisConnection });

// Create invoice queue
const invoiceQueue = new Queue(INVOICE_QUEUE, { connection: redisConnection });

//  * Add email job

async function addEmailJob(order, userEmail) {
  await emailQueue.add("sendOrderEmail", {
    orderId: order._id,
    email: userEmail,
    userId: order.userId,
  });
}


//  * Add invoice job

async function addInvoiceJob(order) {
  await invoiceQueue.add("generateInvoice", {
    orderId: order._id,
    userId: order.userId,
    amount: order.totalAmount,
  });
}

module.exports = {
  addEmailJob,
  addInvoiceJob,
};

const Request = require("../models/Request");
const Order = require("../models/Order");

async function createOrder(req, res) {
  const { requestId } = req.body || {};
  if (!requestId) return res.status(400).json({ message: "requestId is required" });
  const request = await Request.findOne({ _id: requestId, status: "approved" });
  if (!request) return res.status(404).json({ message: "Request not found or not approved" });
  const order = await Order.create({ request: request._id, status: "created" });
  res.status(201).json(order);
}

async function listOrders(req, res) {
  const { status } = req.query || {};
  const query = {};
  if (status) query.status = status;
  const orders = await Order.find(query).sort({ createdAt: -1 }).populate({ path: "request", populate: { path: "createdBy", select: "name email" } });
  res.json(orders);
}

async function getOrder(req, res) {
  const { orderId } = req.params;
  const order = await Order.findById(orderId).populate({ path: "request", populate: { path: "createdBy", select: "name email" } });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
}

async function dispatchOrder(req, res) {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  order.status = "dispatched";
  await order.save();
  res.json(order);
}

async function deliverOrder(req, res) {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  order.status = "delivered";
  await order.save();
  res.json(order);
}

module.exports = { createOrder, listOrders, getOrder, dispatchOrder, deliverOrder };



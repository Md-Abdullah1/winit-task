const Request = require("../models/Request");

async function listMyRequests(req, res) {
  const { status } = req.query;
  const query = { createdBy: req.user.id };
  if (status) query.status = status;
  const requests = await Request.find(query).sort({ createdAt: -1 });
  res.json(requests);
}

async function createRequest(req, res) {
  const request = await Request.create({ createdBy: req.user.id, items: [], status: "draft" });
  res.status(201).json(request);
}

async function addItem(req, res) {
  const { requestId } = req.params;
  const { type, name, quantity, notes } = req.body;
  const request = await Request.findOne({ _id: requestId, createdBy: req.user.id });
  if (!request) return res.status(404).json({ message: "Request not found" });
  if (request.status !== "draft") return res.status(400).json({ message: "Cannot add items unless draft" });
  request.items.push({ type, name, quantity, notes });
  await request.save();
  res.json(request);
}

async function submitForApproval(req, res) {
  const { requestId } = req.params;
  const { priority } = req.body || {};
  const request = await Request.findOne({ _id: requestId, createdBy: req.user.id });
  if (!request) return res.status(404).json({ message: "Request not found" });
  if (!request.items.length) return res.status(400).json({ message: "Add at least one item" });
  if (priority && ["normal", "emergency"].includes(priority)) {
    request.priority = priority;
  }
  request.status = "submitted";
  await request.save();
  res.json(request);
}

async function listApprovedOrRejected(req, res) {
  const requests = await Request.find({ createdBy: req.user.id, status: { $in: ["approved", "rejected"] } }).sort({ updatedAt: -1 });
  res.json(requests);
}

module.exports = { listMyRequests, createRequest, addItem, submitForApproval, listApprovedOrRejected };



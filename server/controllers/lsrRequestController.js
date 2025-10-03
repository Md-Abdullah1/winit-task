const Request = require("../models/Request");
const mongoose = require("mongoose");

const DUMMY_LSR_ID = new mongoose.Types.ObjectId("64b64b64b64b64b64b64b64b");

function resolveUserObjectId(req) {
  const id = req?.user?.id;
  if (id && mongoose.Types.ObjectId.isValid(id)) return id;
  return DUMMY_LSR_ID;
}

async function listMyRequests(req, res) {
  try {
    const { status } = req.query;
    const query = { createdBy: resolveUserObjectId(req) };
    if (status) query.status = status;
    const requests = await Request.find(query).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to list requests" });
  }
}

async function createRequest(req, res) {
  try {
    const request = await Request.create({ createdBy: resolveUserObjectId(req), items: [], status: "draft" });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: "Failed to create request" });
  }
}

async function addItem(req, res) {
  try {
    const { requestId } = req.params;
    const { type, name, quantity, notes } = req.body;
    const request = await Request.findOne({ _id: requestId, createdBy: resolveUserObjectId(req) });
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "draft") return res.status(400).json({ message: "Cannot add items unless draft" });
    request.items.push({ type, name, quantity, notes });
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: "Failed to add item" });
  }
}

async function submitForApproval(req, res) {
  try {
    const { requestId } = req.params;
    const { priority } = req.body || {};
    const request = await Request.findOne({ _id: requestId, createdBy: resolveUserObjectId(req) });
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (!request.items.length) return res.status(400).json({ message: "Add at least one item" });
    if (priority && ["normal", "emergency"].includes(priority)) {
      request.priority = priority;
    }
    request.status = "submitted";
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit request" });
  }
}

async function listApprovedOrRejected(req, res) {
  try {
    const requests = await Request.find({ createdBy: resolveUserObjectId(req), status: { $in: ["approved", "rejected"] } }).sort({ updatedAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to list history" });
  }
}

module.exports = { listMyRequests, createRequest, addItem, submitForApproval, listApprovedOrRejected };



const Request = require("../models/Request");
const mongoose = require("mongoose");

const DUMMY_AGENT_ID = new mongoose.Types.ObjectId("64c64c64c64c64c64c64c64c");

async function listPending(req, res) {
  const { status } = req.query; // optional fulfillmentStatus filter
  const query = { status: "submitted" };
  if (status) query.fulfillmentStatus = status;
  const requests = await Request.find(query).sort({ createdAt: -1 }).populate("createdBy", "name email");
  res.json(requests);
}

async function approve(req, res) {
  const { requestId } = req.params;
  const request = await Request.findOne({ _id: requestId, status: "submitted" });
  if (!request) return res.status(404).json({ message: "Request not found or not submitted" });
  request.status = "approved";
  request.approvedBy = mongoose.Types.ObjectId.isValid(req?.user?.id) ? req.user.id : DUMMY_AGENT_ID;
  request.rejectionReason = undefined;
  await request.save();
  res.json(request);
}

async function reject(req, res) {
  const { requestId } = req.params;
  const { reason } = req.body;
  const request = await Request.findOne({ _id: requestId, status: "submitted" });
  if (!request) return res.status(404).json({ message: "Request not found or not submitted" });
  request.status = "rejected";
  request.approvedBy = undefined;
  request.rejectionReason = reason || "";
  await request.save();
  res.json(request);
}

async function listApproved(req, res) {
  const requests = await Request.find({ status: "approved" }).sort({ updatedAt: -1 }).populate("createdBy", "name email");
  res.json(requests);
}

async function listHistory(req, res) {
  const requests = await Request.find({ status: { $in: ["approved", "rejected"] } }).sort({ updatedAt: -1 }).populate("createdBy", "name email");
  res.json(requests);
}

// Return flattened pending items from submitted requests for item-level review
async function listPendingItems(req, res) {
  const requests = await Request.find({ status: "submitted" }).sort({ createdAt: -1 }).populate("createdBy", "name email");
  const items = [];
  for (const request of requests) {
    for (const item of request.items || []) {
      const p = item.payload || {};
      items.push({
        id: `${request._id}:${item.name}`,
        requestId: String(request._id),
        sku: p.sku || item.name,
        name: p.name || item.name,
        lsr: request.createdBy?.name || "",
        requested: p.requested ?? item.quantity,
        stock: p.stock ?? null,
        approved: p.approved ?? item.quantity,
        priority: request.priority || "normal",
        customer: p.customer || "",
      });
    }
  }
  res.json(items);
}

// Mark a submitted/approved request as in-transit stage in fulfillment
async function markInTransit(req, res) {
  const { requestId } = req.params;
  const request = await Request.findOne({ _id: requestId, status: { $in: ["approved", "submitted"] } });
  if (!request) return res.status(404).json({ message: "Request not found or invalid status" });
  request.fulfillmentStatus = "logistics"; // enter logistics/in-transit pipeline
  await request.save();
  res.json({ ok: true, requestId, status: request.fulfillmentStatus });
}

// Assign logistics resources to an approved request
async function assign(req, res) {
  const { requestId } = req.params;
  const { truckId, driverId } = req.body || {};
  const request = await Request.findOne({ _id: requestId, status: "approved" });
  if (!request) return res.status(404).json({ message: "Request not found or not approved" });
  // Minimal fields here: record assignment in fulfillmentStatus stage
  request.fulfillmentStatus = "logistics";
  await request.save();
  res.json({ ok: true, requestId, truckId, driverId });
}

// Generate load sheet and advance fulfillment status
async function generateLoadSheet(req, res) {
  const { requestId } = req.params;
  const request = await Request.findOne({ _id: requestId, status: "approved" });
  if (!request) return res.status(404).json({ message: "Request not found or not approved" });
  request.fulfillmentStatus = "forklift";
  await request.save();
  res.json({ ok: true });
}

module.exports = { listPending, approve, reject, listApproved, listHistory, listPendingItems, assign, generateLoadSheet, markInTransit };



const Request = require("../models/Request");

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
  request.approvedBy = req.user.id;
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

module.exports = { listPending, approve, reject, listApproved, listHistory };



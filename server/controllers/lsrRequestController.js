const Request = require("../models/Request");
const mongoose = require("mongoose");

const DUMMY_LSR_ID = new mongoose.Types.ObjectId("64b64b64b64b64b64b64b64b");

function resolveUserObjectId(req) {
  const id = req?.user?.id;
  if (id && mongoose.Types.ObjectId.isValid(id)) return id;
  return DUMMY_LSR_ID;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function toNonNegativeNumber(value, fallback = 0) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return n;
}

function validateAndNormalizeItem(body = {}) {
  const { type } = body;
  if (!isNonEmptyString(type) || !["commercial", "posm"].includes(type)) {
    return { ok: false, error: "Invalid type" };
  }

  const sku = body.sku;
  const name = body.name;
  if (!isNonEmptyString(sku) || !isNonEmptyString(name)) {
    return { ok: false, error: "Missing sku or name" };
  }

  const orderQty = Number(body.orderQty);
  if (!Number.isFinite(orderQty) || orderQty < 1) {
    return { ok: false, error: "Invalid orderQty" };
  }

  const payload = {
    sku,
    name,
    category: isNonEmptyString(body.category) ? body.category : undefined,
    brand: isNonEmptyString(body.brand) ? body.brand : undefined,
    uom: isNonEmptyString(body.uom) ? body.uom : undefined,
    pack: isNonEmptyString(body.pack) ? body.pack : undefined,
    mrp: body.mrp !== undefined ? body.mrp : undefined,
    stock: toNonNegativeNumber(body.stock, undefined),
    reserved: toNonNegativeNumber(body.reserved, undefined),
    available: toNonNegativeNumber(body.available, undefined),
    avg: toNonNegativeNumber(body.avg, undefined),
    customer: isNonEmptyString(body.customer) ? body.customer : undefined,
    requested: toNonNegativeNumber(body.requested ?? orderQty),
    approved: toNonNegativeNumber(body.approved ?? orderQty),
  };

  // Remove undefined keys for cleanliness
  Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

  const item = {
    type,
    name,
    quantity: orderQty,
    notes: isNonEmptyString(body.notes) ? body.notes : undefined,
    payload: { ...payload, orderQty },
  };
  return { ok: true, item };
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
    const validation = validateAndNormalizeItem(req.body);
    if (!validation.ok) return res.status(400).json({ message: validation.error });
    const request = await Request.findOne({ _id: requestId, createdBy: resolveUserObjectId(req) });
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "draft") return res.status(400).json({ message: "Cannot add items unless draft" });
    request.items.push(validation.item);
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



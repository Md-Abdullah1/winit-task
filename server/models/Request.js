const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["commercial", "posm"], required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    notes: { type: String },
    // Store the full incoming item payload for UI tables
    payload: { type: mongoose.Schema.Types.Mixed }
  },
  { _id: false }
);

const requestSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "LsrUser", required: true },
    items: { type: [itemSchema], default: [] },
    status: { type: String, enum: ["draft", "submitted", "approved", "rejected"], default: "draft" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AgentUser" },
    rejectionReason: { type: String },
    priority: { type: String, enum: ["normal", "emergency"], default: "normal" },
    fulfillmentStatus: { type: String, enum: ["pending", "logistics", "forklift", "shipped"], default: "pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);



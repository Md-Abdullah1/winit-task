const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: "Request", required: true },
    status: { type: String, enum: ["created", "dispatched", "delivered"], default: "created" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);



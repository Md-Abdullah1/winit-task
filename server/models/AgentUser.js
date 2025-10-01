const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const agentUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "agent", enum: ["agent"] }
  },
  { timestamps: true }
);

agentUserSchema.pre("save", async function hashPasswordIfModified(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

agentUserSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("AgentUser", agentUserSchema);



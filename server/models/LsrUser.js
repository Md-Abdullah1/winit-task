const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const lsrUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "lsr", enum: ["lsr"] }
  },
  { timestamps: true }
);

lsrUserSchema.pre("save", async function hashPasswordIfModified(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

lsrUserSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("LsrUser", lsrUserSchema);



const AgentUser = require("../models/AgentUser");
const { signToken } = require("../middlewares/auth");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const existing = await AgentUser.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already in use" });
    const user = await AgentUser.create({ name, email, password });
    return res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    return res.status(400).json({ message: "Registration failed" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await AgentUser.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = signToken({ id: user.id, role: user.role });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(400).json({ message: "Login failed" });
  }
}

module.exports = { register, login };



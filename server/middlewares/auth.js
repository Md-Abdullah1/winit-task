const jwt = require("jsonwebtoken");

function requireAuth(allowedRoles = []) {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length)
        : null;
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      const secret = process.env.JWT_SECRET || "dev_secret_change_me";
      const payload = jwt.verify(token, secret);
      if (allowedRoles.length && !allowedRoles.includes(payload.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = payload; // { id, role }
      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}

function signToken({ id, role }) {
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";
  return jwt.sign({ id, role }, secret, { expiresIn: "7d" });
}

module.exports = { requireAuth, signToken };



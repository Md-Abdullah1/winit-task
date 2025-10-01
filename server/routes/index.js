const express = require("express");

const router = express.Router();

// Role-specific routers
const lsrRouter = require("./lsr");
const agentRouter = require("./agent");

// GET /api -> simple message
router.get("/", (req, res) => {
  res.json({ message: "API is up" });
});

// Mount role routers
router.use("/lsr", lsrRouter);
router.use("/agent", agentRouter);

module.exports = router;

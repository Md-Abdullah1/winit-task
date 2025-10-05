const express = require("express");
const { requireAuth } = require("../middlewares/auth");
const { list, create } = require("../controllers/productController");

const router = express.Router();

// Products - allow both roles to fetch; creation allowed for LSR for now
router.get("/", requireAuth(["lsr", "agent"]), list);
router.post("/", requireAuth(["lsr"]), create);

module.exports = router;





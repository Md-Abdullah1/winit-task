const express = require("express");
const { requireAuth } = require("../middlewares/auth");
const { register, login } = require("../controllers/agentAuthController");
const { listPending, approve, reject, listApproved, listHistory } = require("../controllers/agentRequestController");

const router = express.Router();

// Auth
router.post("/auth/register", register);
router.post("/auth/login", login);

// Requests (requires Agent role)
router.get("/requests/pending", requireAuth(["agent"]), listPending);
router.post("/requests/:requestId/approve", requireAuth(["agent"]), approve);
router.post("/requests/:requestId/reject", requireAuth(["agent"]), reject);
router.get("/requests/approved", requireAuth(["agent"]), listApproved);
router.get("/requests/history", requireAuth(["agent"]), listHistory);

module.exports = router;



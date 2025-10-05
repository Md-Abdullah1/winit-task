const express = require("express");
const { requireAuth } = require("../middlewares/auth");
const { register, login } = require("../controllers/agentAuthController");
const { listPending, approve, reject, listApproved, listHistory, listPendingItems, markInTransit } = require("../controllers/agentRequestController");

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
// Items feed used by AgentPending page
router.get("/requests/items", requireAuth(["agent"]), listPendingItems);
// Mark request in-transit/logistics
router.post("/requests/:requestId/in-transit", requireAuth(["agent"]), markInTransit);

module.exports = router;



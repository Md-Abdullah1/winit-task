const express = require("express");
const { requireAuth } = require("../middlewares/auth");
const { register, login } = require("../controllers/lsrAuthController");
const { listMyRequests, createRequest, addItem, submitForApproval, listApprovedOrRejected } = require("../controllers/lsrRequestController");

const router = express.Router();

// Auth
router.post("/auth/register", register);
router.post("/auth/login", login);

// Requests (requires LSR role)
router.get("/requests", requireAuth(["lsr"]), listMyRequests);
router.post("/requests", requireAuth(["lsr"]), createRequest);
router.post("/requests/:requestId/items", requireAuth(["lsr"]), addItem);
router.post("/requests/:requestId/submit", requireAuth(["lsr"]), submitForApproval);
router.get("/requests/history", requireAuth(["lsr"]), listApprovedOrRejected);

module.exports = router;



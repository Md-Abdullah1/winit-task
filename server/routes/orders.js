const express = require("express");
const { requireAuth } = require("../middlewares/auth");
const { createOrder, listOrders, getOrder, dispatchOrder, deliverOrder } = require("../controllers/orderController");

const router = express.Router();

router.post("/", requireAuth(["agent", "lsr"]), createOrder);
router.get("/", requireAuth(["agent", "lsr"]), listOrders);
router.get("/:orderId", requireAuth(["agent", "lsr"]), getOrder);
router.post("/:orderId/dispatch", requireAuth(["agent"]), dispatchOrder);
router.post("/:orderId/deliver", requireAuth(["agent"]), deliverOrder);

module.exports = router;



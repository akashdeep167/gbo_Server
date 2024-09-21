const express = require("express");
const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const orderController = require("../controllers/order.controller"); // Assuming you have an order controller

const router = express.Router();

// Middleware to add headers
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Order routes

// POST route for creating an order (requires authentication)
router.post("/orders", [authJwt.verifyToken], orderController.createOrder);

// GET route for fetching all orders (requires authentication)
router.get("/orders", [authJwt.verifyToken], orderController.getAllOrders);
router.delete(
  "/orders/:order_id",
  [authJwt.verifyToken, authJwt.isAdmin],
  orderController.deleteOrder
);
router.put(
  "/orders/:order_id",
  [authJwt.verifyToken, authJwt.isAdmin],
  orderController.updateOrder
);


module.exports = router;

const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const rateController = require("../controllers/rate.controller");
const authMiddleware = require("../middlewares/auth");

// Admin-only middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};

// Rate
router.post("/rate", authMiddleware, adminOnly, rateController.setRate);
router.get("/rate", authMiddleware, adminOnly, rateController.getRate);

// Orders
router.get("/orders", authMiddleware, adminOnly, adminController.getAllOrders);
router.patch("/orders/:id/approve", authMiddleware, adminOnly, adminController.approveOrder);
router.patch("/orders/:id/decline", authMiddleware, adminOnly, adminController.declineOrder);

// Dashboard
router.get("/dashboard", authMiddleware, adminOnly, adminController.getMetrics);

module.exports = router;

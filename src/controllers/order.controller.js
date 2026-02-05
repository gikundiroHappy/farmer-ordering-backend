const prisma = require("../lib/prisma");

// Create order (Farmer)
exports.createOrder = async (req, res) => {
  try {
    const { landArea } = req.body;

    if (!landArea || landArea <= 0) {
      return res.status(400).json({ message: "Invalid land area" });
    }

    // Get current fertilizer rate
    const rate = await prisma.rate.findFirst({ orderBy: { id: "desc" } });
    if (!rate) return res.status(400).json({ message: "Rate not set by admin" });

    const fertilizerQty = landArea * rate.value;

    const order = await prisma.order.create({
      data: {
        landArea,
        fertilizerQty,
        status: "PENDING",
        farmerId: req.user.id,
      },
    });

    res.json({ message: "Order created", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get farmer's orders
exports.getMyOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { farmerId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json({ orders });
};

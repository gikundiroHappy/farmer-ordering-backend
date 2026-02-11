const prisma = require("../lib/prisma");

exports.getAllOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    include: { farmer: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ orders });
};

exports.approveOrder = async (req, res) => {
  const { id } = req.params;
  const order = await prisma.order.update({
    where: { id: parseInt(id) },
    data: { status: "APPROVED" },
  });
  res.json({ message: "Order approved", order });
};

exports.declineOrder = async (req, res) => {
  const { id } = req.params;
  const order = await prisma.order.update({
    where: { id: parseInt(id) },
    data: { status: "DECLINED" },
  });
  res.json({ message: "Order declined", order });
};

exports.getMetrics = async (req, res) => {
  const approved = await prisma.order.count({ where: { status: "APPROVED" } });
  const declined = await prisma.order.count({ where: { status: "DECLINED" } });
  const pending = await prisma.order.count({ where: { status: "PENDING" } });

  res.json({ approved, declined, pending });
};

const prisma = require("../lib/prisma");

// Set fertilizer rate (Admin)
exports.setRate = async (req, res) => {
  try {
    const { value } = req.body;

    if (!value || value <= 0) {
      return res.status(400).json({ message: "Invalid rate value" });
    }

    // Create a new rate entry (latest rate used for calculations)
    const rate = await prisma.rate.create({ data: { value } });

    res.json({ message: "Rate set successfully", rate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get latest rate
exports.getRate = async (req, res) => {
  const rate = await prisma.rate.findFirst({ orderBy: { id: "desc" } });
  res.json({ rate });
};

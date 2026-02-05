const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Farmer Registration
exports.registerFarmer = async (req, res) => {
  const { fullName, phoneNumber } = req.body;

  const existing = await prisma.user.findUnique({ where: { phoneNumber } });
  if (existing) {
    return res.status(400).json({ message: "Phone number already registered" });
  }

  const farmer = await prisma.user.create({
    data: {
      fullName,
      phoneNumber,
      role: "FARMER",
    },
  });

  res.json({ message: "Farmer registered", farmer });
};

// Login (Farmer + Admin)
exports.login = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  // Admin login
  if (phoneNumber === "25078815000" && otp === "0001") {
    let admin = await prisma.user.findUnique({ where: { phoneNumber } });

    if (!admin) {
      admin = await prisma.user.create({
        data: {
          phoneNumber,
          role: "ADMIN",
        },
      });
    }

    return res.json({
      token: generateToken(admin),
      role: "ADMIN",
    });
  }

  // Farmer login
  if (otp !== "1234") {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  const farmer = await prisma.user.findUnique({ where: { phoneNumber } });
  if (!farmer) {
    return res.status(404).json({ message: "Farmer not found" });
  }

  res.json({
    token: generateToken(farmer),
    role: "FARMER",
  });
};

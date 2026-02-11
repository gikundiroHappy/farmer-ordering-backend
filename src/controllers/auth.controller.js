const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");
const { Role } = require("@prisma/client");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

exports.registerFarmer = async (req, res) => {
  try {
    const { fullName, phoneNumber } = req.body;

    const existing = await prisma.user.findUnique({ where: { phoneNumber } });
    if (existing) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    const farmer = await prisma.user.create({
      data: {
        fullName,
        phoneNumber,
        role: Role.FARMER,
      },
    });

    res.json({ message: "Farmer registered", farmer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (phoneNumber === "25078815000" && otp === "0001") {
      let admin = await prisma.user.findUnique({ where: { phoneNumber } });

      if (!admin) {
        admin = await prisma.user.create({
          data: {
            phoneNumber,
            fullName: "Admin",
            role: Role.ADMIN,           
          },
        });
      }

      return res.json({
        token: generateToken(admin),
        role: "ADMIN",
        fullName: admin.fullName,
      });
    }

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
      fullName: farmer.fullName,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

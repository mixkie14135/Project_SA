const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET from .env:", JWT_SECRET);

// ✅ ลงทะเบียนผู้ใช้ใหม่
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: { username, email, password: hashedPassword },
    });

    res.json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ เข้าสู่ระบบ
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: user.user_id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ เพิ่ม API GET เพื่อดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่
exports.getUser = async (req, res) => {
  try {
    // ใช้ JWT token ที่ส่งมาจาก Authorization header
    const token = req.headers.authorization.split(" ")[1]; // "Bearer <token>"
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // ตรวจสอบ token และดึงข้อมูลผู้ใช้จาก token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.users.findUnique({
      where: { user_id: decoded.userId }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ username: user.username, email: user.email }); // ส่งกลับชื่อผู้ใช้และอีเมล
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// เพิ่มฟังก์ชันแก้ไข username ใน authController.js
exports.updateUsername = async (req, res) => {
  try {
    const { username } = req.body;

    // ตรวจสอบว่า username ที่ส่งมาคือค่าว่างหรือไม่
    if (!username || username.trim() === "") {
      return res.status(400).json({ error: "Username cannot be empty" }); // ส่ง error ถ้าเป็นค่าว่าง
    }

    const token = req.headers.authorization.split(" ")[1]; // "Bearer <token>"

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.users.update({
      where: { user_id: decoded.userId },
      data: { username: username },  // อัปเดต username
    });

    res.json({ message: "Username updated successfully!", username: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





const express = require("express");
const { register, login, getUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// เพิ่มเส้นทาง GET เพื่อดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่
router.get("/me", getUser);

module.exports = router;

const express = require("express");
const { register, login, getUser, updateUsername } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// เพิ่มเส้นทาง GET เพื่อดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่
router.get("/me", getUser);
router.put("/update-username", updateUsername);  // เส้นทางสำหรับอัพเดตชื่อผู้ใช้



module.exports = router;

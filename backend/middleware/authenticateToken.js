const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // แยก "Bearer token"

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  // ตรวจสอบ token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    console.log("User from token:", user);  // เพิ่มการ log เพื่อดูค่า user จาก token
    req.user = user;  // เก็บข้อมูล user ใน req.user
    next();
  });  
};

module.exports = authenticateToken;

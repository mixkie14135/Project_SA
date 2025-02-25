const express = require('express');
const { getNotifications, markNotificationAsRead, checkDueTasksAndNotify } = require('../controllers/notificationController');

const router = express.Router();

// ✅ API เส้นใหม่สำหรับแจ้งเตือน Due Date
router.get('/notifications/due-tasks', checkDueTasksAndNotify);

// ✅ ดึงแจ้งเตือนของผู้ใช้
router.get('/notifications/:user_id', getNotifications);

// ✅ อัปเดตว่าอ่านแจ้งเตือนแล้ว
router.put('/notifications/:notification_id/read', markNotificationAsRead);



module.exports = router;

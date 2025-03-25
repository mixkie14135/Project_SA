const express = require('express');
const { getNotifications, markNotificationAsRead, checkDueTasksAndNotify } = require('../controllers/notificationController');

const router = express.Router();


router.get('/notifications/due-tasks', checkDueTasksAndNotify);

router.get('/notifications/:user_id', getNotifications);


router.put('/notifications/:notification_id/read', markNotificationAsRead);



module.exports = router;
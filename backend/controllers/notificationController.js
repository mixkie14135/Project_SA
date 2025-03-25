const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const createNotification = async (user_id, task_id, message) => {
    await prisma.notifications.create({
        data: { user_id, task_id, message }
    });
};
const getNotifications = async (req, res) => {
    const user_id = Number(req.params.user_id); 
    console.log("🔍 user_id ที่รับมา:", req.params.user_id); 
    console.log("🔍 user_id ที่แปลงเป็น Number:", user_id); 
    if (!user_id || isNaN(user_id)) {
        return res.status(400).json({ error: "Invalid user_id provided" });
    }
    try {
        const notifications = await prisma.notifications.findMany({
            where: { user_id: user_id }, 
            orderBy: { created_at: "desc" }
        });
        console.log("✅ แจ้งเตือนที่พบ:", notifications);
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const markNotificationAsRead = async (req, res) => {
    const { notification_id } = req.params;
    try {
        await prisma.notifications.update({
            where: { notification_id: Number(notification_id) },
            data: { is_read: true }
        });
        res.status(200).json({ message: "Notification marked as read" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const checkDueTasksAndNotify = async (req, res) => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1); 
    try {
        const dueTasks = await prisma.tasks.findMany({
            where: {
                due_date: {
                    gte: now, lt: tomorrow }
            },
            include: { users: true  }
        });
        console.log("🔍 งานที่ครบกำหนดส่ง:", dueTasks); 
        let notifications = [];
        for (const task of dueTasks) {
            if (!task.user_id) {
                console.warn(`⚠️ Task ID ${task.task_id} ไม่มี user_id`);
                continue;
            }
            const existingNotification = await prisma.notifications.findFirst({
                where: {
                    user_id: task.user_id,
                    task_id: task.task_id,
                    message: `งานของคุณ "${task.title}" ใกล้ถึงกำหนดส่ง!`
                }
            });
            if (!existingNotification) {
                const notification = await prisma.notifications.create({
                    data: {
                        user_id: task.user_id,
                        task_id: task.task_id,
                        message: `งานของคุณ "${task.title}" ใกล้ถึงกำหนดส่ง!`,
                    }
                });
                notifications.push(notification);
            } else {
                console.log(`🔔 แจ้งเตือนสำหรับ Task ID ${task.task_id} มีอยู่แล้ว`);
            }
        }
        console.log("✅ แจ้งเตือนที่สร้างขึ้น:", notifications);
        res.status(200).json({ message: `สร้างแจ้งเตือนสำหรับ ${notifications.length} งานที่ครบกำหนด`, notifications });
    } catch (err) {
        console.error("❌ Error checking due tasks:", err);
        res.status(500).json({ error: err.message });
    }
};
module.exports = { createNotification, getNotifications, markNotificationAsRead, checkDueTasksAndNotify };

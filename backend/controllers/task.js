const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createNotification } = require('./notificationController'); // ✅ เพิ่มการนำเข้า notificationController.js



// ✅ Insert a new task
const createTask = async (req, res) => {
    const { title, description, user_id, category_id, status_id, priority_id, due_date } = req.body;
    try {
        const task = await prisma.tasks.create({
            data: {
                title,
                description,
                user_id,
                category_id,
                status_id,
                priority_id,
                due_date
            }
        });

        // ✅ สร้างการแจ้งเตือนเมื่อมีการเพิ่มงานใหม่
        await createNotification(user_id, task.task_id, `คุณได้สร้างงานใหม่: ${title}`);
        
        res.status(200).json({
            status: "ok",
            message: `Task with id ${task.task_id} created successfully`,
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Error while creating the task",
            error: err.message
        });
    }
};

// ✅ Get all tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await prisma.tasks.findMany();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Get a single task by id
const getTask = async (req, res) => {
    const id = req.params.id;
    try {
        const task = await prisma.tasks.findUnique({
            where: { task_id: Number(id) },
        });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Delete a task
const deleteTask = async (req, res) => {
    const id = req.params.id;
    try {
        const existingTask = await prisma.tasks.findUnique({
            where: { task_id: Number(id) }
        });
        if (!existingTask) {
            return res.status(404).json({ status: "error", message: "Task not found" });
        }
        await prisma.tasks.delete({ where: { task_id: Number(id) } });
        res.status(200).json({ status: "ok", message: `Task with id ${id} deleted successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Update a task
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, user_id, category_id, status_id, priority_id, due_date } = req.body;

    const data = {};
    if (title) data.title = title;
    if (description) data.description = description;
    if (user_id) data.user_id = user_id;
    if (category_id) data.category_id = category_id;
    if (status_id) data.status_id = status_id;
    if (priority_id) data.priority_id = priority_id;
    if (due_date) data.due_date = due_date;

    if (Object.keys(data).length === 0) {
        return res.status(400).json({ status: "error", message: "Please provide data to update" });
    }

    try {
        const task = await prisma.tasks.update({
            where: { task_id: Number(id) },
            data
        });
        res.status(200).json({ status: "ok", message: `Task with id = ${id} is updated successfully`, task });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ status: "error", message: `Task with id = ${id} not found` });
        } else {
            res.status(500).json({ status: "error", message: "Error updating task", error: err.message });
        }
    }
};

module.exports = { createTask, getTasks, getTask, deleteTask, updateTask };

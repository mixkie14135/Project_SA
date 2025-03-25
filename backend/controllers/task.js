const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createNotification } = require('./notificationController'); 
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; 
const createTask = async (req, res) => {
  const { title, description, category_id, status_id, priority_id, due_date } = req.body;

  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user_id = decoded.userId;

    if (!user_id) {
      return res.status(400).json({ message: 'User not found' });
    }
    const task = await prisma.tasks.create({
      data: {title, description, user_id, category_id, status_id, priority_id, due_date}});
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
const getTasks = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; 
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET); 
    const tasks = await prisma.tasks.findMany({
      where: { user_id: decoded.userId }, 
    });
    res.status(200).json(tasks); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getTask = async (req, res) => {
  const id = req.params.id;
  try {
    const task = await prisma.tasks.findUnique({
      where: { task_id: Number(id) },
      include: { 
        categories: true, 
        status: true, 
        priority: true, 
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      ...task,
      category_name: task.categories.category_name, 
      status_name: task.status.status, 
      priority_name: task.priority.priority, 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.categories.findMany();  
    res.status(200).json(categories);  
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStatuses = async (req, res) => {
  try {
    const statuses = await prisma.status.findMany();  
    res.status(200).json(statuses);  
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getPriorities = async (req, res) => {
  try {
    const priorities = await prisma.priority.findMany();  
    res.status(200).json(priorities);  
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { createTask, getTasks, getTask, deleteTask, updateTask, getCategories, getStatuses, getPriorities };
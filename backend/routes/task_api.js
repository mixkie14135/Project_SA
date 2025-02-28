const express = require('express');
const { createTask, getTasks, getTask, deleteTask, updateTask, getCategories, getStatuses, getPriorities } = require('../controllers/task.js');

const router = express.Router();

router.post('/tasks', createTask);
router.get('/tasks', getTasks);
router.get('/tasks/:id', getTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

// เพิ่ม API ใหม่ที่ดึงข้อมูล categories, statuses และ priorities
router.get('/categories', getCategories);
router.get('/status', getStatuses);
router.get('/priority', getPriorities);

module.exports = router;

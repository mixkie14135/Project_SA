const express = require('express');
const { createTask, getTasks, getTask, deleteTask, updateTask } = require('../controllers/task.js');

const router = express.Router();

router.post('/tasks', createTask);
router.get('/tasks', getTasks);
router.get('/tasks/:id', getTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

module.exports = router;

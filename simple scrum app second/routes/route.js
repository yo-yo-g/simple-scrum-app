const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/user.controller');
const task_controller = require('../controllers/task.controller');

// user related
router.post('/register/user', user_controller.createUser);
router.post('/login/user', user_controller.loginUser);
router.get('/get/user', user_controller.getUser);
router.delete('/delete/user', user_controller.deleteUser);

// task related
router.post('/create/task', task_controller.createTask);
router.get('/get/tasks', task_controller.getTasks);
router.put('/update/task', task_controller.updateTask);
router.delete('/delete/task', task_controller.deleteTask);

module.exports = router;

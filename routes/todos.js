const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const todosControllers = require('../controllers/todos-controllers');
const checkAuth = require('../middleware/check-auth');

router.get('/', todosControllers.getAllTodos);

router.get('/:uid', todosControllers.getTodosByUid);

router.get('/todo/:id', todosControllers.getTodosById);

router.use(checkAuth);

router.post(
  '/',
  [check('description').not().isEmpty(), check('checked').not().isEmpty()],
  todosControllers.addTodos
);

module.exports = router;

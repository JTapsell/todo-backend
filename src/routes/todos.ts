import express from 'express';
import { check } from 'express-validator';

const router = express.Router();

import {
  getAllTodos,
  updateTodo,
  deleteTodo,
  getTodosByUid,
  getTodosById,
  addTodos,
} from '../controllers/todos-controllers';
import { checkAuth } from'../middleware/check-auth';

router.get('/', getAllTodos);

router.patch('/', updateTodo);

router.delete('/', deleteTodo);

router.get('/:uid', getTodosByUid);

router.get('/todo/:id', getTodosById);

router.use(checkAuth);

router.post(
  '/',
  [check('description').not().isEmpty(), check('checked').not().isEmpty()],
  addTodos
);

module.exports = router;

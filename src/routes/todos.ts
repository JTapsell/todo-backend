import express from 'express';
import { check } from 'express-validator';

const todoRouter = express.Router();

import {
  getAllTodos,
  updateTodo,
  deleteTodo,
  getTodosByUid,
  getTodosById,
  addTodos,
} from '../controllers/todos-controllers';
import { checkAuth } from'../middleware/check-auth';

todoRouter.get('/', getAllTodos);

todoRouter.patch('/', updateTodo);

todoRouter.delete('/', deleteTodo);

todoRouter.get('/:uid', getTodosByUid);

todoRouter.get('/todo/:id', getTodosById);

todoRouter.use(checkAuth);

todoRouter.post(
  '/',
  [check('description').not().isEmpty(), check('checked').not().isEmpty()],
  addTodos
);

export { todoRouter }
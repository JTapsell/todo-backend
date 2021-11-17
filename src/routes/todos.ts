import express from 'express';
import { body, check } from 'express-validator';

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

todoRouter.get('/:uid', getTodosByUid);

todoRouter.get('/todo/:id', getTodosById);

todoRouter.delete('/todo/:id', deleteTodo);

todoRouter.use(checkAuth);

todoRouter.post(
  '/',
  [check('description').not().isEmpty(), check('checked').not().isEmpty()],
  addTodos
);

todoRouter.patch('/todo/:id',  [check('description').not().isEmpty(), check('checked').not().isEmpty()], updateTodo);


export { todoRouter }
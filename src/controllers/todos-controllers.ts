import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { HttpError } from '../models/http-error';
import { Todo } from '../models/todo';
import { User } from '../models/user';

export const getAllTodos = async (req: Request, res: Response, next) => {
  let todos;
  try {
    todos = await Todo.find({});
  } catch (err) {
      const error = new HttpError('Getting Todos failed');
    return next(error);
  }
  res.json({ todos: todos.map(todo => todo.toObject({ getters: true })) });
};
export const getTodosByUid = async (req: Request, res: Response, next) => {
  const userId = req.params.uid;
  let userWithTodos;

  try {
    userWithTodos = await User.findById(userId).populate('todos');
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find todos');
    return next(error);
  }

  if (!userWithTodos || userWithTodos.length === 0) {
    const error = new HttpError('Could not find todos for this user');
    return next(error);
  }

  res.json({ todos: userWithTodos.todos.map(todo => todo.toObject({ getters: true })) });
};

export const getTodosById = async (req: Request, res: Response, next) => {
  const todoId = req.params.id;
  let todo;

  try {
    todo = await Todo.findById(todoId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find todo');
    return next(error);
  }

  if (!todo || todo.length === 0) {
    const error = new HttpError('Could not find todo by this id');
    return next(error);
  }

  res.json({ todo: todo.toObject({ getters: true }) });
};

export const addTodos = async (req: Request, res: Response, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError('Invalid inputs, please check your data');
    return next(error);
  }

  const { description, checked } = req.body;
  const createdTodo = new Todo({
    uid: req.body.userId,
    description,
    checked,
  });

  let user;

  try {
    user = await User.find(req.body.userId);
  } catch (err) {
    const error = new HttpError('Adding todo failed 1');
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user with this id');
    return next(error);
  }
  try {
    const session = await mongoose.startSession();
    await session.startTransaction();
    await createdTodo.save({ session });
    user.todos.push(createdTodo);
    await user.save({ session });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError('Adding todo failed');
    return next(error);
  }

  res.status(201).json({ todo: createdTodo });
};

export const updateTodo = async (req: Request, res: Response, next) => {
  const updatedTodo = req.body.updatedTodo;
};

export const deleteTodo = async (req: Request, res: Response, next) => {
  const deletedTodo = req.body.deletedTodo;
};

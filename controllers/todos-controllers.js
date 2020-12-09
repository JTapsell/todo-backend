const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');
const Todo = require('../models/todo');
const User = require('../models/user');

const getAllTodos = async (req, res, next) => {
  let todos;
  try {
    todos = await Todo.find({});
  } catch (err) {
    const error = new HttpError('Getting Todos failed', 500);
    return next(error);
  }
  res.json({ todos: todos.map(todo => todo.toObject({ getters: true })) });
};
const getTodosByUid = async (req, res, next) => {
  const userId = req.params.uid;
  let userWithTodos;

  try {
    userWithTodos = await User.findById(userId).populate('todos');
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find todos', 500);
    return next(error);
  }

  if (!userWithTodos || userWithTodos.length === 0) {
    const error = new HttpError('Could not find todos for this user', 404);
    return next(error);
  }

  res.json({ todos: userWithTodos.todos.map(todo => todo.toObject({ getters: true })) });
};

const getTodosById = async (req, res, next) => {
  const todoId = req.params.id;
  let todo;

  try {
    todo = await Todo.findById(todoId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find todo', 500);
    return next(error);
  }

  if (!todo || todo.length === 0) {
    const error = new HttpError('Could not find todo by this id', 404);
    return next(error);
  }

  res.json({ todo: todo.toObject({ getters: true }) });
};

const addTodos = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError('Invalid inputs, please check your data', 422);
    return next(error);
  }

  const { description, checked } = req.body;
  const createdTodo = new Todo({
    uid: req.userData.userId,
    description,
    checked,
  });

  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError('Adding todo failed 1', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user with this id', 400);
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
    const error = new HttpError('Adding todo failed 2', 500);
    return next(error);
  }

  res.status(201).json({ todo: createdTodo });
};

module.exports = {
  getAllTodos,
  getTodosByUid,
  getTodosById,
  addTodos,
};

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('Error occurred getting users, please try again', 500);
    return next(error);
  }

  res.status(200).json({ users: users.map(user => user.toObject({ getters: true })) });
};
const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError('Invalid inputs, please check your data', 422);
    return next(error);
  }

  const { firstName, lastName, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Signup failed, please try again later', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError('Signup failed, email is already in use');
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError('Could not create User', 500);
    next(error);
  }

  const createdUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    todos: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Sign up failed', 500);
    return next(error);
  }

  let token;

  try {
    token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, process.env.JWT_KEY, {
      expiresIn: '12h',
    });
  } catch (err) {
    const error = new HttpError('Sign up failed', 500);
    return next(error);
  }

  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;

  try {
    user = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('login failed', 500);
    next(error);
  }

  if (!user) {
    const error = new HttpError('Could not login, please check credentials', 401);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    const error = new HttpError('Could not login, please check credentials', 500);
    next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError('Could not login, please check credentials', 401);
    return next(error);
  }

  let token;

  try {
    token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_KEY, {
      expiresIn: '12h',
    });
  } catch (err) {
    const error = new HttpError('Logging in failed', 500);
    return next(error);
  }

  res.status(201).json({ userId: user.id, email: user.email, token });
};

module.exports = {
  getUsers,
  signUp,
  login,
};

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { HttpError } from '../models/http-error';
import { User } from '../models/user';

export const getUsers = async (req: Request, res: Response, next) => {
  let users;

  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('Error occurred getting users, please try again');
    return next(error);
  }

  res.status(200).json({ users: users.map(user => user.toObject({ getters: true })) });
};

export const signUp = async (req: Request, res: Response, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError('Invalid inputs, please check your data');
    return next(error);
  }

  const { firstName, lastName, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Signup failed, please try again later');
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
    const error = new HttpError('Could not create User');
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
    const error = new HttpError('Sign up failed');
    return next(error);
  }

  let token;

  try {
    token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, 'placeholder_key', {
      expiresIn: '12h',
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError('Sign up failed');
    return next(error);
  }

  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token });
};

export const login = async (req: Request, res: Response, next) => {
  const { email, password } = req.body;
  let user;

  try {
    user = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('login failed');
    next(error);
  }

  if (!user) {
    const error = new HttpError('Could not login, please check credentials');
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    const error = new HttpError('Could not login, please check credentials');
    next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError('Could not login, please check credentials');
    return next(error);
  }

  let token;

  try {
    token = jwt.sign({ userId: user.id, email: user.email }, 'placeholder_key', {
      expiresIn: '12h',
    });
    console.log(token)
  } catch (err) {
    console.log(err)
    const error = new HttpError('Logging in failed');
    return next(error);
  }

  res.status(201).json({ userId: user.id, email: user.email, token });
};

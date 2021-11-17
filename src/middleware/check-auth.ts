import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HttpError } from '../models/http-error';

export const checkAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]

    if (!token) {
      throw new Error('authorization failed');
    }  
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.body = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError('Authorization failed');
    next(error);
  }
};

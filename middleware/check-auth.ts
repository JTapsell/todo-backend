import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HttpError } from '../models/http-error';

export const checkAuth = (req: Request, res: Response, next): void => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]

    if (!token) {
      throw new Error('authorization failed');
    }
    console.log(token);
  
    const decodedToken = jwt.verify(token, 'placeholder_key');
    req.body = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new HttpError('Authorization failed');
    next(error);
  }
};

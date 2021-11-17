import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

require('dotenv').config();

import { todoRouter } from './src/routes/todos';
import { userRouter } from './src/routes/users';

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/todos/', todoRouter);
app.use('/api/users/', userRouter);

app.use((error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unexpected error has occurred' });
});

mongoose
  .connect(`${process.env.MONGO_CLIENT}`)
  .then(() => app.listen(8080))
  .catch(err => console.log(err));

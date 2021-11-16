const express = require('express');

require('dotenv').config();

const mongoose = require('mongoose');

const todoRoutes = require('./src/routes/todos');
const userRoutes = require('./src/routes/users');

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/todos/', todoRoutes);
app.use('/api/users/', userRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unexpected error has occurred' });
});

mongoose
  .connect(

    `${process.env.MONGO_CLIENT}`
  )
  .then(() => app.listen(8080))
  .catch(err => console.log(err));

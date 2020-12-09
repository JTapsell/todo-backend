const express = require('express');

const mongoose = require('mongoose');

const todoRoutes = require('./routes/todos');
const userRoutes = require('./routes/users');

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
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1il8s.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => app.listen(8080))
  .catch(err => console.log(err));

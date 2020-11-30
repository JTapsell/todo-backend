const express = require('express')
const bodyParser = require('body-parser');
const router = express.Router();


const todoRoutes = require('./routes/todos');
const userRoutes = require('./routes/users');

const app = express();

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use('/api/todos/', todoRoutes)
app.use('/api/users/', userRoutes)

app.use((req, res, next) => {

})

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unexpected error has occurred'})
})

app.listen(8080)
const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator') 

const DUMMY_TODOS = [
    {
        uid: 1,
        description: 'Test',
        checked: false
    },
    {
        uid: 1,
        description: 'Test',
        checked: false
    },
    {
        uid: 2,
        description: 'Test',
        checked: false
    }
]


const getTodosById = (req, res, next) => {
    const userId = req.params.uid
    const todos = DUMMY_TODOS.filter(t => t.uid == userId)
    if (todos.length == 0) {
        throw new HttpError('Could not find todos for this user', 404)
        // return next(new HttpError('Could not find todos for this user', 404) )
    }
    console.log('Get request');
    res.json({todos});
}

const addTodos = (req, res, next) => {
    const errors = validationResult(req)
    console.log(errors)
    if(!errors.isEmpty()) {
        throw new HttpError('Invalid inputs, please check your data', 422)
    }
    const { description, checked, uid } = req.body
    const createdTodo = {
        description,
        checked,
        uid
    }
    DUMMY_TODOS.push(createdTodo)

    res.status(201).json({todo: createdTodo})
}

const updateTodos = (req, res, next) => {

}

module.exports = { 
    getTodosById,
    addTodos,
    updateTodos
}
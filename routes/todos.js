const express = require('express');
const { check } = require('express-validator')
const router = express.Router();

const todosControllers = require('../controllers/todos-controllers');

router.get('/:uid', todosControllers.getTodosById) 

router.post('/', [
    check('description').not().isEmpty(),
    check('checked').not().isEmpty(),
    check('uid').not().isEmpty()
],
 todosControllers.addTodos)

router.patch('/:uid', todosControllers.updateTodos)

module.exports = router;
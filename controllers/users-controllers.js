const HttpError = require('../models/http-error')
const { v4: uuidv4 } = require('uuid')
const { validationResult } = require('express-validator') 


const DUMMY_USERS = [
    {
        id: '1',
        first_name: 'john',
        last_name: 'tapsell',
        email: 'jwtapsell@gmail.com',
        password: "test123",
    }
]

const getUsers = (req, res, next) => {
    res.status(200).json({users: DUMMY_USERS })
}
const signUp = (req, res, next) => {
    const errors = validationResult(req)
    console.log(errors)
    if(!errors.isEmpty()) {
        throw new HttpError('Invalid inputs, please check your data', 422)
    }
    const { first_name, last_name, email, password } = req.body
    const createdUser = {
        id: uuidv4(),
        first_name,
        last_name,
        email,
        password
    }

    console.log(createdUser)

    DUMMY_USERS.push(createdUser)

    res.status(201).json({user : createdUser})
}

const login = (req, res, next) => {
    const { email, password} = req.body
    const user = DUMMY_USERS.find(u => email === u.email)
    if(!user) {
        throw new HttpError('Could not find user with this email, please check credentials', 401)
    }

    res.json({message: 'Logged in'})
}

module.exports = { 
    getUsers,
    signUp,
    login
}
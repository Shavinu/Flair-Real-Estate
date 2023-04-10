const express = require('express')
const router = express.Router()
const {
    getUsers,
    getaUser,
    createUser,
    loginUser,
    deleteUser,
    updateUser
} = require('../controllers/userController')

//Get all users
router.get('/', getUsers)

//Get single user
router.get('/:id', getaUser)

//register a new user
router.post('/register', createUser)

//login a user
router.post('/login', loginUser)

//verify login


//delete a user
router.delete('/:id', deleteUser)

//UPDATE a user
router.patch('/:id', updateUser)

module.exports = router

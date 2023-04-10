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

//Get single users
router.get('/:id', getaUser)

//post a new user
router.post('/', createUser)

//login a user
router.get('/:email', loginUser)

//delelete a user
router.delete('/:id', deleteUser)

//UPDATE a user
router.patch('/:id', updateUser)

module.exports = router

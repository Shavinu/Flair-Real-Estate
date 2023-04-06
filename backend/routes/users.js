const express = require('express')
const router = express.Router()
const {
    getUsers,
    getaUser,
    createUser,
    deleteUser,
    updateUser
} = require('../controllers/userController')

//Get all users
router.get('/', getUsers)

//Get singal users
router.get('/:id', getaUser)

//post a new user
router.post('/', createUser)

//delelete a user
router.delete('/:id', deleteUser)

//UPDATE a user
router.patch('/:id', updateUser)

module.exports = router
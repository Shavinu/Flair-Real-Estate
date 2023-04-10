const express = require('express')
const router = express.Router()
const {
    getUsers,
    getaUser,
    createUser
} = require('../controllers/userController')

//Get all users
router.get('', getUsers)

//Get single users
router.get('/:id', getaUser)

//post a new user
router.post('/', createUser)

//delete a user
router.delete('/:id', (req, res) => {
    res.json({ mssg: "DELETE USER" })
})

//UPDATE a user
router.patch('/:id', (req, res) => {
    res.json({ mssg: "UPDATE USER" })
})

module.exports = router;

const express = require('express')
const router = express.Router()
const { verifyAccessToken } = require('../helpers/token');
const {
    getUsers,
    getaUser,
    createUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    deleteUser,
    updateUser
} = require('../controllers/userController')

//Get all users
router.get('', getUsers)

//Get single user
router.get('/:id', getaUser)

//register a new user
router.post('/register', createUser)

//login a user
router.post('/login', loginUser)

//Get current user token
router.post('/current-user', verifyAccessToken, getCurrentUser);

//Refresh token
router.post('/refresh-token', async (req, res, next) => {
    res.send('This is refresh-token route');
});

//logout a user (IDK why its .delete tho)
router.delete('/logout', async (req, res, next) => {
    res.send('This is logout route');
});


//delete a user
router.delete('/:id', deleteUser)

//UPDATE a user
router.patch('/:id', updateUser)

module.exports = router;

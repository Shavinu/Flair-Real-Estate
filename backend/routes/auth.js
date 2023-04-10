const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../helpers/token');
const {
    register,
    login,
    getCurrentUser,
} = require('../controllers/authController');

router.post('/register', register);

router.post('/login', login);

router.post('/current-user', verifyAccessToken, getCurrentUser);

router.post('/refresh-token', async (req, res, next) => {
    res.send('This is refresh-token route');
});

router.delete('/logout', async (req, res, next) => {
    res.send('This is logout route');
});

module.exports = router;

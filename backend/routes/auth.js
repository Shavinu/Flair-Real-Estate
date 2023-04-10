const express = require('express');
const router = express.Router();

router.post('/register', async (req, res, next) => {
    res.send('This is register route');
});

router.post('/login', async (req, res, next) => {
    res.send('This is login route');
});

router.post('/refresh-token', async (req, res, next) => {
    res.send('This is refresh-token route');
});

router.delete('/logout', async (req, res, next) => {
    res.send('This is logout route');
});

module.exports = router;

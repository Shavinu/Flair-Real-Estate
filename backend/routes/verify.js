const express = require('express');
const router = express.Router();
const { verifyLicense } = require('../controllers/verifyIdController');

//Get access token
router.get('/verifyLicense', verifyLicense)

module.exports = router;
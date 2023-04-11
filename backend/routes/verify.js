const express = require('express');
const router = express.Router();
const { verifyLicense } = require('../controllers/verifyIdController');

//verify license
router.get('/verifyLicense', verifyLicense)

module.exports = router;
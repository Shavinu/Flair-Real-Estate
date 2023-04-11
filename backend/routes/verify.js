const express = require('express');
const router = express.Router();
const { verifyLicense } = require('../controllers/verifyIdController');
const { altVerifyLicense } = require('../controllers/altVerifyIdController');

//verify license
router.get('/verifyLicense', verifyLicense)
router.get('/altVerifyLicense/:id', altVerifyLicense)

module.exports = router;
const express = require('express');
const router = express.Router();
const { verifyLicense } = require('../controllers/verifyIdController');
// const { altVerifyLicense } = require('../controllers/altVerifyIdController');

//verify license
router.get('/verifyid/:id/:idType', verifyLicense)
// router.get('/altVerifyLicense/:idType/:id', altVerifyLicense)

module.exports = router;
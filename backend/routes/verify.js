const express = require('express');
const router = express.Router();
const { verifyLicence } = require('../controllers/verifyLicenceController');

//verify license
//id is the licence number
//idType can be 'agent', 'agency', 'certificate', 'builder', 'developer'
router.get('/:id/:idType', verifyLicence)

module.exports = router;
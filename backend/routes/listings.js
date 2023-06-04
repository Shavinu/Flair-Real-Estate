const express = require('express')
const router = express.Router()
const {
    getListings,
    getaListing,
    createListing,
    deleteListing,
    updateListing,
} = require('../controllers/listingsController')

//Get all Listings
router.get('', getListings)

//Get single Listing
router.get('/:id', getaListing)

//register a new Listing
router.post('/create', createListing)

//delete a Listing
router.delete('/:id', deleteListing)


//UPDATE a Listing
router.patch('/:id', updateListing)

module.exports = router;

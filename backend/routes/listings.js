const express = require('express')
const router = express.Router()
const {
    getListings,
    searchListings,
    getListingsByDeveloper,
    getDevelopersWithListings,
    getaListing,
    createListing,
    deleteListing,
    updateListing,
    getUnapprovedListing,
    approveListing,
} = require('../controllers/listingsController')

//Get all the unapproved listings
router.get('/unapproved', getUnapprovedListing)

//approved listings
router.post('/approve', approveListing)

//Get all Listings
router.get('', getListings)

//Get all Listings by developer
router.get('/developer/:id', getListingsByDeveloper)

//Get single Listing
router.get('/:id', getaListing)

//register a new Listing
router.post('/create', createListing)

//delete a Listing
router.delete('/:id', deleteListing)

//UPDATE a Listing
router.patch('/:id', updateListing)

module.exports = router;

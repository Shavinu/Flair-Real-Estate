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
} = require('../controllers/listingsController')

//Get all Listings
router.get('', getListings)

//Get all Listings by developer
router.get('/developer/:id', getListingsByDeveloper)

//Get all developers with listings
router.get('/developers', getDevelopersWithListings)

//Search Listings
router.get('/search', searchListings);

//Get single Listing
router.get('/:id', getaListing)

//register a new Listing
router.post('/create', createListing)

//delete a Listing
router.delete('/:id', deleteListing)

//UPDATE a Listing
router.patch('/:id', updateListing)

module.exports = router;

const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const listingsController = require('../controllers/listingsController');

// Projects
// Get project Owners
router.get('/projectOwners', projectController.getUsersWithProjects);

// Search projects
router.get('/projects_search', projectController.searchProjects);


// Listings
//Get all developers with listings
router.get('/developers', listingsController.getDevelopersWithListings)

//Search Listings
router.get('/listings_search', listingsController.searchListings);

module.exports = router;
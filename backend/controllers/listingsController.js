const { response } = require('express');
const Listing = require('../models/listingsModel');
const mongoose = require('mongoose');
const { listingSchema } = require('../helpers/validation');


//get all listings
const getListings = async (req, res) => {
    const listings = await Listing.find().sort({ CreateAt: -1 });

    res.status(200).json(listings);
};

//get single listing
const getaListing = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Not a vaild ID' });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
        return res.status(404).json({ error: 'No listings found' });
    }

    res.status(200).json(listing);
};

//create new listing
const createListing = async (req, res) => {
    try {
        const listing = await listingSchema.validateAsync(req.body);
        res.status(200).json(listing)
    } catch (error) {
        res.status(400).json({ error: 'cannot create listing' })
        console.log(error)
    }
}

//delete Listing
const deleteListing = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'NoT a Vaild id' });
    }

    const listing = await Listing.findOneAndDelete({ _id: id });

    if (!listing) {
        return res.status(404).json({ error: 'no Listings found' });
    }

    res.status(200).json(listing);
};

//update Listing
const updateListing = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Not a valid id' });
    }

    const listing = await Listing.findOneAndUpdate(
        { _id: id },
        {
            ...req.body,
        }
    );

    if (!listing) {
        return res.status(404).json({ error: 'no listing found' });
    }

    res.status(200).json(listing);
};

module.exports = {
    getListings,
    getaListing,
    createListing,
    deleteListing,
    updateListing,
};

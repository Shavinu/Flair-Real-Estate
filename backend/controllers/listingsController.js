const { response } = require('express');
const Listing = require('../models/listingsModel');
const Project = require('../models/projectModel');
const mongoose = require('mongoose');
const { listingSchema } = require('../helpers/validation');


//get all listings
const getListings = async (req, res) => {
    const listings = await Listing.find().sort({ CreateAt: -1 });

    res.status(200).json(listings);
};

//get all listings by developer
const getListingsByDeveloper = async (req, res) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = page && limit ? (page - 1) * limit : 0;
        const search = req.query.search || '';

        const listingsQuery = Listing.find({
            devloper: id,
            listingName: { $regex: search, $options: 'i' },
        })
            .populate('devloper', '_id firstName lastName email')
            .sort({ createdAt: -1 });

        if (skip) {
            listingsQuery.skip(skip);
        }

        if (limit) {
            listingsQuery.limit(limit);
        }

        const listings = await listingsQuery.exec();

        const totallistings = await Listing.countDocuments({
            devloper: id,
            listingName: { $regex: search, $options: 'i' },
        });

        res.status(200).json({
            listings,
            currentPage: page || 1,
            totalPages: limit ? Math.ceil(totallistings / limit) : 1,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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
        const vaildListing = await listingSchema.validateAsync(req.body);
        const listing = new Listing(vaildListing);
        const savedListing = await listing.save();

        //if validListing has project, add listing ID to project
        if (vaildListing.project) {
            const project = await Project.findById(vaildListing.project);
            project.projectListings.push(savedListing._id);
            await project.save();
        }

        res.status(201).json(savedListing);
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
    getListingsByDeveloper,
    getaListing,
    createListing,
    deleteListing,
    updateListing,
};

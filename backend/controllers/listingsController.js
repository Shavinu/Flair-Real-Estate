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

//get all listings by query
const searchListings = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skip = page && limit ? (page - 1) * limit : 0;

    const {
      listingName,
      type,
      status,
      priceRange,
      streetAddress,
      postcode,
      region,
      landSize,
      bedrooms,
      bathrooms,
      carSpaces,
      project,
      devloper,
    } = req.query;

    const queryObject = {};

    if (listingName) queryObject.listingName = { $regex: listingName, $options: 'i' };
    if (type) queryObject.type = type;
    if (status) queryObject.status = status;
    if (priceRange && (priceRange.minPrice === '' || priceRange.minPrice !== undefined)) {
      queryObject['priceRange.minPrice'] = { $gte: priceRange.minPrice };
    }
    if (priceRange && (priceRange.maxPrice === '' || priceRange.maxPrice !== undefined)) {
      queryObject['priceRange.maxPrice'] = { $lte: priceRange.maxPrice };
    }
    if (streetAddress) queryObject.streetAddress = { $regex: streetAddress, $options: 'i' };
    if (postcode) queryObject.postcode = postcode;
    if (region) queryObject.region = { $regex: region, $options: 'i' };
    if (landSize) queryObject.landSize = { $gte: landSize };
    if (bedrooms) queryObject.bedrooms = { $gte: bedrooms };
    if (bathrooms) queryObject.bathrooms = { $gte: bathrooms };
    if (carSpaces) queryObject.carSpaces = { $gte: carSpaces };
    if (project) queryObject.project = project;
    if (devloper) queryObject.devloper = devloper;

    const listingsQuery = Listing.find(queryObject)
      .populate('devloper', '_id firstName lastName email')
      .sort({ createdAt: -1 });

    if (skip) {
      listingsQuery.skip(skip);
    }

    if (limit) {
      listingsQuery.limit(limit);
    }

    const listings = await listingsQuery.exec();

    const totalListings = await Listing.countDocuments(queryObject);

    res.status(200).json({
      listings,
      currentPage: page || 1,
      totalPages: limit ? Math.ceil(totalListings / limit) : 1,
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

//get developers with at least one listing
const getDevelopersWithListings = async (req, res) => {
  try {
    const developers = await Listing.aggregate([
      {
        $group: {
          _id: '$devloper',
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 0 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'developer',
        },
      },
      {
        $unwind: '$developer',
      },
      {
        $project: {
          _id: 0,
          developer: {
            _id: '$developer._id',
            firstName: '$developer.firstName',
            lastName: '$developer.lastName',
            email: '$developer.email',
            count: '$count',
          },
        },
      },
    ]);

    res.status(200).json(developers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
  searchListings,
  getListingsByDeveloper,
  getDevelopersWithListings,
  getaListing,
  createListing,
  deleteListing,
  updateListing,
};

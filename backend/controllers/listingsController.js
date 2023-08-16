const { response } = require('express');
const Listing = require('../models/listingsModel');
const Project = require('../models/projectModel');
const User = require('../models/userModel');
const Group = require('../models/groupModel');
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
      suburb,
      postcode,
      region,
      landSize,
      bedrooms,
      bathrooms,
      carSpaces,
      project,
      devloper,
      listingCommission
    } = req.query;

    const queryObject = {};

    if (listingName) queryObject.listingName = { $regex: listingName, $options: 'i' };
    if (type) queryObject.type = type;
    if (status) queryObject.status = status;
    if (priceRange && priceRange.minPrice !== undefined && priceRange.minPrice !== '') {
      queryObject['priceRange.minPrice'] = { $gte: priceRange.minPrice };
    }
    if (priceRange && (priceRange.maxPrice !== undefined && priceRange.maxPrice !== '')) {
      queryObject['priceRange.maxPrice'] = { $lte: priceRange.maxPrice };
    }
    if (streetAddress) queryObject.streetAddress = { $regex: streetAddress, $options: 'i' };
    if (suburb) queryObject.suburb = { $regex: suburb, $options: 'i' };
    if (postcode) queryObject.postcode = postcode;
    if (region) queryObject.region = { $regex: region, $options: 'i' };
    if (landSize) queryObject.landSize = { $lte: landSize };
    if (bedrooms) queryObject.bedrooms = { $lte: bedrooms };
    if (bathrooms) queryObject.bathrooms = { $lte: bathrooms };
    if (carSpaces) queryObject.carSpaces = { $lte: carSpaces };
    if (project) queryObject.project = { $regex: project, $options: 'i' };
    if (devloper !== undefined && devloper !== null && devloper !== '' && devloper !== '0') {
      queryObject.devloper = devloper;
    } else if (devloper === '0') {
      queryObject.devloper = '000000000000000000000000';
    }
    if (listingCommission && listingCommission.exists === 'true') {
      queryObject['listingCommission.exists'] = true;
      if (listingCommission.type) {
        if (listingCommission.type === 'fixed') {
          let amount = listingCommission.amount || 0;
          queryObject['listingCommission.type'] = 'fixed';
          queryObject['listingCommission.amount'] = { $gte: amount };
        }

        if (listingCommission.type === 'percentage') {
          let percent = listingCommission.percent || 0;
          queryObject['listingCommission.type'] = 'percentage';
          queryObject['listingCommission.percent'] = { $gte: percent };
        }
      }
    } else if (listingCommission && listingCommission.exists === 'false') {
      queryObject['listingCommission.exists'] = false;
    }

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

//get notapproved listing
const getUnapprovedListing = async(req, res) => {
  try {
    const listingsQuery = Listing.find({
      listingApproved: false,
    })
      .sort({ createdAt: -1 });

    const listings = await listingsQuery.exec();

    res.status(200).json({
      listings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveListing = async (req, res) => {
  try{
  const { id } = req.body;
  const filter = {_id: id};
  //console.log('Received ID:', id);
  const update = { listingApproved: true };
  const approvedListing = await Listing.findOneAndUpdate(filter, update, {
    new: true
  });

  if (!approvedListing) {
    return res.status(404).json({ message: 'Listing not found or could not be updated.' });
  }

  //res.status(200).json(approvedListing);
  res.status(200).json({ message: "Listing Approved!" });
  }
  catch (error)
  {
    res.status(500).json({ message: 'An error occurred while updating the listing.' });
  }
};


//create new listing
const createListing = async (req, res) => {
  try {
    const vaildListing = await listingSchema.validateAsync(req.body);
    const listing = new Listing(vaildListing);

    //if validListing has project, add listing ID to project
    const savedListing = await listing.save();

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

  const listing = await Listing.findById(id);

  if (!listing) {
    return res.status(404).json({ error: 'no listing found' });
  }

  const { project, ...updateData } = req.body;

  if (project && project !== listing.project) {
    const currentProject = await Project.findOne({ _id: listing.project });
    if (currentProject) {
      currentProject.projectListings = currentProject.projectListings.filter(
        (listingId) => listingId.toString() !== id
      );
      await currentProject.save();
    }

    const newProject = await Project.findOne({ _id: project });
    if (newProject) {
      newProject.projectListings.push(listing._id);
      await newProject.save();
    }

    updateData.project = project;

  } else if (!project && listing.project) {
    const currentProject = await Project.findOne({ _id: listing.project });
    if (currentProject) {
      currentProject.projectListings = currentProject.projectListings.filter(
        (listingId) => listingId.toString() !== id
      );
      await currentProject.save();
    }

    updateData.project = null;
  }

  const updatedListing = await Listing.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
  });

  res.status(200).json(updatedListing);
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
  getUnapprovedListing,
  approveListing,
};

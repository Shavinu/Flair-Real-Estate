const { meta } = require('@hapi/joi/lib/base');
const mongoose = require('mongoose');
const { exists } = require('./fileModel');
const Schema = mongoose.Schema
const Joi = require('@hapi/joi');

const projectSchema = new Schema({
  projectName: {
    type: String,
    required: true
  },
  //Land or Multiple
  //For listings -> House, House and Land Package, Apartment & Unit, Townhouse, Duplex, Villa, Land, Acreage, Rural
  projectType: {
    type: String,
    required: true
  },
  projectPriceRange: [{
    _id: false,
    minPrice: {
      type: Number,
      required: true
    },
    maxPrice: {
      type: Number,
      required: true
    }
  }],
  projectDescription: {
    type: String,
    required: true
  },
  projectLocation: [{
    _id: false,
    locationName: {
      type: String,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    latitude: {
      type: Number,
      required: true
    },
    postcode: {
      type: Number,
      required: true
    },
    region: {
      type: String,
      required: true
    },
    suburb: {
      type: String,
      required: true
    },
  }],
  projectTitleImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: false,
    default: null
  },
  projectSlideImages: [
    {
      type: Map,
      of: mongoose.Schema.Types.ObjectId,
      ref: 'File',
      required: false,
      default: []
    }
  ],
  // file ref
  projectFiles: [
    {
      file_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: true
      },
      category: {
        type: String,
        required: true
      },
      category_index: {
        type: Number,
        required: true
      },
      fileName: {
        type: String,
        required: true
      },
      displayTop: {
        type: Boolean,
        required: true,
        default: false
      },
      visibleTo: [{
        type: String,
        required: true
      }]
    }
  ],
  projectListings: {
    type: Array,
    required: false,
    default: []
  },
  projectOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // groups, subgroups and members that can edit the project
  editableBy: [{
    _id: false,
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group'
    },
    includeAllGroupMembers: {
      type: Boolean,
      required: true,
      default: true
    },
    groupMembers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    includeSubGroups: {
      type: Boolean,
      required: true,
      default: false
    },
    subgroups: [{
      subgroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
      },
      includeAllSubgroupMembers: {
        type: Boolean,
        required: true,
        default: false,
      },
      subgroupMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
    }]
  }],
  // can be Registered, Unregistered, Off the Plan, Ready to Move In
  projectStatus: {
    type: String,
    required: true
  },
  projectCommission: [{
    _id: false,
    exists: {
      type: Boolean,
      required: true,
      default: false
    },
    type: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: false,
    },
    percent: {
      type: Number,
      required: false,
    },
  }],
}, { timestamps: true })

module.exports = mongoose.model('Project', projectSchema)

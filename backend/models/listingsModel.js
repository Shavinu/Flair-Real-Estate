const { number } = require('@hapi/joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Land or Multiple House, House and Land Package, Apartment & Unit, Townhouse, Duplex, Villa, Land, Acreage, Rural

const listingSchema = new Schema({
  listingName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  priceRange: [{
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
  description: {
    type: String,
    required: true
  },
  streetAddress: {
    type: String,
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
  coordinates: [{
    _id: false,
    longitude: {
      type: Number,
      required: true
    },
    latitude: {
      type: Number,
      required: true
    }
  }],
  landSize: {
    type: Number,
    required: false,
    default: null
  },
  bedrooms: {
    type: Number,
    required: false,
    default: null
  },
  bathrooms: {
    type: Number,
    required: false,
    default: null
  },
  carSpaces: {
    type: Number,
    required: false,
    default: null
  },
  titleImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: false
  },
  slideImages: [
    {
      type: Map,
      of: mongoose.Schema.Types.ObjectId,
      ref: 'File',
      required: false,
      default: []
    }
  ],
  files: [
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
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: false,
    default: null
  },
  devloper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  listingCommission: [{
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

module.exports = mongoose.model('listing', listingSchema)

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
        required: false
    },
    bedrooms: {
        type: Number,
        required: false
    },
    bathrooms: {
        type: Number,
        required: false
    },
    carSpaces: {
        type: Number,
        required: false
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

}, { timestamps: true })

module.exports = mongoose.model('listing', listingSchema)

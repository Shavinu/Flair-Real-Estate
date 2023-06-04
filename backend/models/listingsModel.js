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
    priceRange: {
        type: String,
        required: true
    },
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
    devloper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

}, { timestamps: true })

module.exports = mongoose.model('listing', listingSchema)

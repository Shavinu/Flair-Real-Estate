const { meta } = require('@hapi/joi/lib/base');
const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    projectPriceRange: {
        type: String,
        required: true
    },
    projectDescription: {
        type: String,
        required: true
    },
    projectLocation: {
        type: String,
        required: true
    },
    projectTitleImage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: false
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
    //include objectid of files and their categories
    projectFiles: [
        {
            type: Map,
            of: mongoose.Schema.Types.ObjectId,
            ref: 'File',
            required: false,
            default: []
        }
    ],
    // optional
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
    // Add members of the builder group
    projectMembers: {
        type: Array,
        required: false,
        default: function() {
            return [this.projectOwner];
        }
    },
    // can be Registered, Unregistered, Off the Plan, Ready to Move In
    projectStatus: {
        type: String,
        required: true
    },
}, { timestamps: true })

module.exports = mongoose.model('Project', projectSchema)

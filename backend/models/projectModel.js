const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema({
    projectName: {
        type: String,
        required: true
    },
    projectType: {
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
    projectFiles: [
        {
          file: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
          },
          label: String
        }
    ],
    projectListings: {
        type: Array,
        required: true
    },
    projectOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectMembers: {
        type: Array,
        required: true
    },
    projectStatus: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Project = mongoose.model('Project', projectSchema)

module.exports = Project

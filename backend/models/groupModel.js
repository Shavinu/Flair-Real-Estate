const mongoose = require('mongoose')
const Schema = mongoose.Schema

const groupSchema = new Schema({
    groupType: {
        type: String,
        required: true
    },
    groupLicence: {
        type: String,
        unique: true,
        required: [true, 'Please enter a group licence number']
    },
    groupName: {
        type: String,
        required: true
    },
    groupContact: {
        type: String,
    },
    groupEmail: {
        type: String,
    },
    groupArea: {
        type: String,
    }
}, { timestamps: true })

module.exports = mongoose.model('Group', groupSchema)

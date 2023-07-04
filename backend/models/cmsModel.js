const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cmsSchema = new Schema({
    page: {
        type: String,
        required: true
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: false
    },
    pdf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: false
    },
    textBody: {
        type: String,
        required: false
    },
    serviceId: {
        type: String,
        required: false
    },
    templateId: {
        type: String,
        required: false
    },
    publicKey: {
        type: String,
        required: false
    }
})
module.exports = mongoose.model('Cms', cmsSchema);
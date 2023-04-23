const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    metadata: {
        createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
        },
        label: {
            type: String,
            required: true
        }
    },
    length: {
        type: Number,
        required: true
    },
    chunkSize: {
        type: Number,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    md5: {
        type: String,
        required: true
    }
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
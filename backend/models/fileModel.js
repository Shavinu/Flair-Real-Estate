//Use to modify file metadata and filename in the 'uploads' gridfs bucket.

const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  chunkSize: {
    type: Number,
    required: true,
  },
  uploadDate: {
    type: Date,
    required: true,
  },
  aliases: {
    type: String,
    default: null,
  },
  metadata: {
    createdBy: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: null,
    },
    parentId: {
      type: String,
      default: null,
      required: false,
    },
    type: {
      type: String,
      default: null,
      required: false,
    },
  },
  md5: {
    type: String,
    required: true,
  },
});

const File = mongoose.model("File", fileSchema, "uploads.files");

module.exports = File;

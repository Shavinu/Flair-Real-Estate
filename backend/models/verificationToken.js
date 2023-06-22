const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const bcrypt = require('bcrypt');
// const Joi = require('@hapi/joi');

const verificationSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
      expires: 3600, // 1 hour
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('verificationToken', verificationSchema);
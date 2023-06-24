const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestChangeTokenSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('requestToken', requestChangeTokenSchema);

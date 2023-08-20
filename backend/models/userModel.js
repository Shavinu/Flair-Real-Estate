const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');

/*  A user is anyone who is logged in, admins, devlopers, agents, etc
 *   the accType or account type feild dictates the privlges that user has
 */
const userSchema = new Schema(
  {
    avatar: {
      type: String,
    },
    accType: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      required: false,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      validate: [],
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
    },
    licence: {
      type: String,
      unique: true,
      required: true,
    },
    verifiedLicence: {
      type: Boolean,
      default: false,
      required: true,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
    company: {
      type: String,
      required: true,
    },
    addressLine1: {
      type: String,
    },
    addressLine2: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    postcode: {
      type: String,
    },
    favorites: {
      default: {
        listings: [],
        projects: [],
      },
      type: {
        listings: [String],
        projects: [String],
      },
    },
  },
  { timestamps: true }
);

//static signup method
userSchema.statics.signup = async (
  accType,
  firstName,
  lastName,
  phoneNo,
  email,
  password
) => {
  const exists = await this.findOne({ email });

  if (exists) {
    throw Error('Email already in use');
  }
};

// hash the password
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);

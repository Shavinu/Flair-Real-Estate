const Joi = require('@hapi/joi');

const userSchema = Joi.object({
  accType: Joi.string().required(),
  licence: Joi.string().optional(),
  verifiedLicence: Joi.boolean().optional(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phoneNo: Joi.string().required(),
  birthday: Joi.date().allow(null).allow(''),
  company: Joi.string().allow(null).allow(''),
  addressLine1: Joi.string().allow(null).allow(''),
  addressLine2: Joi.string().allow(null).allow(''),
  city: Joi.string().allow(null).allow(''),
  country: Joi.string().allow(null).allow(''),
  postcode: Joi.string().allow(null).allow(''),
  group: Joi.object().keys({_id: Joi.string()}).allow(null).allow(''),
});

const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

const validateSchema = Joi.object({
  accType: Joi.string().required(),
  licence: Joi.string().required(),
})


module.exports = {
  userSchema,
  authSchema,
  validateSchema,
}

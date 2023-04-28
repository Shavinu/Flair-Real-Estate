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
  birthday: Joi.date(),
  company: Joi.string(),
  addressLine1: Joi.string(),
  addressLine1: Joi.string(),
  city: Joi.string(),
  country: Joi.string(),
  postcode: Joi.string()
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

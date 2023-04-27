const Joi = require('@hapi/joi');

const userSchema = Joi.object({
  accType: Joi.string().required(),
  license: Joi.string().required(),
  agency: Joi.string().required(),
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


module.exports = {
  userSchema,
  authSchema,
}

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

const projectSchema = Joi.object({
  projectName: Joi.string().required(),
  projectType: Joi.string().required(),
  projectPriceRange: Joi.string().required(),
  projectDescription: Joi.string().required(),
  projectLocation: Joi.string().required(),
  projectFiles: Joi.array().items(Joi.string()).optional(),
  projectListings: Joi.array().items(Joi.string()).optional(),
  projectOwner: Joi.string().required(),
  projectMembers: Joi.array().items(Joi.string()).optional(),
  projectStatus: Joi.string().required(),
})

const updateProjectSchema = Joi.object({
  projectName: Joi.string().optional(),
  projectType: Joi.string().optional(),
  projectPriceRange: Joi.string().optional(),
  projectDescription: Joi.string().optional(),
  projectLocation: Joi.string().optional(),
  projectFiles: Joi.array().items(Joi.string()).optional(),
  projectListings: Joi.array().items(Joi.string()).optional(),
  projectOwner: Joi.string().optional(),
  projectMembers: Joi.array().items(Joi.string()).optional(),
  projectStatus: Joi.string().optional(),
}).unknown();


module.exports = {
  userSchema,
  authSchema,
  validateSchema,
  projectSchema,
  updateProjectSchema
}

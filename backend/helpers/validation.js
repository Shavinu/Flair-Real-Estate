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
  group: Joi.object().keys({ _id: Joi.string() }).allow(null).allow(''),
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
  projectTitleImage: Joi.string().optional(),
  projectSlideImages: Joi.array().items(Joi.object().pattern(Joi.string(), Joi.string())).optional(),
  projectFiles: Joi.array().items(Joi.object().pattern(Joi.string(), Joi.string())).optional(),
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

const listingSchema = Joi.object({
  listingName: Joi.string().required(),
  type: Joi.string().required(),
  priceRange: Joi.string().required(),
  description: Joi.string().required(),
  streetAddress: Joi.string().required(),
  postcode: Joi.number().required(),
  region: Joi.string().optional(),
  landSize: Joi.number().optional(),
  bedrooms: Joi.number().optional(),
  bathrooms: Joi.number().optional(),
  carSpaces: Joi.number().optional(),
  titleImage: Joi.number().optional(),
  devloper: Joi.string().optional(),
})

module.exports = {
  userSchema,
  authSchema,
  validateSchema,
  projectSchema,
  updateProjectSchema,
  listingSchema
}

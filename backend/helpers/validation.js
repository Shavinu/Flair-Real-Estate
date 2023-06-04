const Joi = require('@hapi/joi');

const userSchema = Joi.object({
  accType: Joi.string().required(),
  jobType: Joi.string().optional(),
  licence: Joi.string().optional(),
  verifiedLicence: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  mobileNo: Joi.string().optional(),
  phoneNo: Joi.string().required(),
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
});

const validateSchema = Joi.object({
  accType: Joi.string().required(),
  licence: Joi.string().required(),
});

const projectSchema = Joi.object({
  projectName: Joi.string().required(),
  projectType: Joi.string().required(),
  projectPriceRange: Joi.array().items(
    Joi.object({
      minPrice: Joi.number().required(),
      maxPrice: Joi.number().required()
    })
  ).required(),
  projectDescription: Joi.string().required(),
  projectLocation: Joi.array().items(
    Joi.object({
      locationName: Joi.string().required(),
      longitude: Joi.number().required(),
      latitude: Joi.number().required()
    })
  ).required(),
  projectTitleImage: Joi.string().optional(),
  projectSlideImages: Joi.array().items(Joi.object().pattern(Joi.string(), Joi.string())).optional(),
  projectFiles: Joi.array().items(
    Joi.object({
      file_id: Joi.string().required(),
      category: Joi.string().required(),
      category_index: Joi.number().required(),
      fileName: Joi.string().required(),
      displayTop: Joi.boolean().required(),
      visibleTo: Joi.array().items(Joi.string().required()).required()
    })
  ).optional(),
  projectListings: Joi.array().items(Joi.string()).optional(),
  projectOwner: Joi.string().required(),
  editableBy: Joi.array().items(
    Joi.object({
      group: Joi.string().required(),
      includeAllGroupMembers: Joi.boolean().required(),
      groupMembers: Joi.array().items(Joi.string()).optional(),
      includeSubGroups: Joi.boolean().required(),
      subgroups: Joi.array().items(
        Joi.object({
          subgroup: Joi.string().required(),
          includeAllSubgroupMembers: Joi.boolean().required(),
          subgroupMembers: Joi.array().items(Joi.string()).optional(),
        })
      ).optional()
    })
  ).optional(),
  projectStatus: Joi.string().required(),
  projectCommission: Joi.array().items(
    Joi.object({
      exists: Joi.boolean().required(),
      type: Joi.string().allow(null).allow('').optional(),
      amount: Joi.number().allow(null).allow('').optional(),
      percent: Joi.number().allow(null).allow('').optional(),
    })
  ).optional()
});

const updateProjectSchema =
  Joi.object({
    projectName: Joi.string().optional(),
    projectType: Joi.string().optional(),
    projectPriceRange: Joi.array().items(
      Joi.object({
        minPrice: Joi.number().required(),
        maxPrice: Joi.number().required()
      })
    ).optional(),
    projectDescription: Joi.string().optional(),
    projectLocation: Joi.array().items(
      Joi.object({
        locationName: Joi.string().required(),
        longitude: Joi.number().required(),
        latitude: Joi.number().required()
      })
    ).optional(),
    projectTitleImage: Joi.string().allow(null).allow('').optional(),
    projectSlideImages: Joi.array().items(Joi.object().pattern(Joi.string(), Joi.string())).allow(null).allow('').optional(),
    projectFiles: Joi.array().items(
      Joi.object({
        file_id: Joi.string().required(),
        category: Joi.string().required(),
        category_index: Joi.number().required(),
        fileName: Joi.string().required(),
        displayTop: Joi.boolean().required(),
        visibleTo: Joi.array().items(Joi.string().required()).required()
      })
    ).optional(),
    projectListings: Joi.array().items(Joi.string()).optional(),
    projectOwner: Joi.string().optional(),
    editableBy: Joi.array().items(
      Joi.object({
        group: Joi.string().required(),
        includeAllGroupMembers: Joi.boolean().required(),
        groupMembers: Joi.array().items(Joi.string()).optional(),
        includeSubGroups: Joi.boolean().required(),
        subgroups: Joi.array().items(
          Joi.object({
            subgroup: Joi.string().required(),
            includeAllSubgroupMembers: Joi.boolean().required(),
            subgroupMembers: Joi.array().items(Joi.string()).optional(),
          })
        ).optional()
      })
    ).optional(),
    projectStatus: Joi.string().optional(),
    projectCommission: Joi.array().items(
      Joi.object({
        exists: Joi.boolean().required(),
        type: Joi.string().allow(null).allow('').optional(),
        amount: Joi.number().allow(null).allow('').optional(),
        percent: Joi.number().allow(null).allow('').optional(),
      })
    ).optional()
  }).min(0);

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

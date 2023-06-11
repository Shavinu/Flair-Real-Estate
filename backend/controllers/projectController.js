const mongoose = require('mongoose');
const Project = require('../models/projectModel');
const User = require('../models/userModel');
const Group = require('../models/groupModel');
const { projectSchema, updateProjectSchema } = require('../helpers/validation');

const projectController = {
  // Create a new project
  createProject: async (req, res) => {
    try {
      const { projectOwner } = req.body;

      // Validate the project data
      const { error } = projectSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      // Check if the project owner exists
      const owner = await User.findById(projectOwner);
      if (!owner) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Create the project
      const newProject = new Project(req.body);

      // Convert projectOwner to ObjectId
      newProject.projectOwner = new mongoose.Types.ObjectId(newProject.projectOwner);

      // Validate and convert editableBy groups to ObjectIds
      if (Array.isArray(newProject.editableBy)) {
        for (const editable of newProject.editableBy) {
          const group = await Group.findById(editable.group);
          if (!group) {
            return res.status(404).json({ message: `Group ${editable.group} not found` });
          }
          editable.group = new mongoose.Types.ObjectId(editable.group);

          // Validate and convert subgroup members to ObjectId
          if (editable.includeSubGroups && Array.isArray(editable.subgroups)) {
            for (const subgroup of editable.subgroups) {
              const subgroupObject = await Group.findById(subgroup.subgroup);
              if (!subgroupObject) {
                return res.status(404).json({ message: `Subgroup ${subgroup.subgroup} not found` });
              }
              subgroup.subgroup = new mongoose.Types.ObjectId(subgroup.subgroup);

              if (Array.isArray(subgroup.subgroupMembers)) {
                subgroup.subgroupMembers = subgroup.subgroupMembers.map(memberId =>
                  new mongoose.Types.ObjectId(memberId)
                );
              }
            }
          }

          // Convert group members to ObjectId
          if (Array.isArray(editable.groupMembers)) {
            editable.groupMembers = editable.groupMembers.map(memberId =>
              new mongoose.Types.ObjectId(memberId)
            );
          }
        }
      }

      const savedProject = await newProject.save();
      res.status(201).json(savedProject);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  // Get all projects
  getAllProjects: async (req, res) => {
    try {
      const projects = await Project.find().populate('projectOwner');
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get a project by ID
  getProjectById: async (req, res) => {
    try {
      const { projectId } = req.params;
      const project = await Project.findById(projectId)
        .populate({
          path: 'projectOwner',
          select: '_id firstName lastName email'
        });
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update a project by ID
  updateProjectById: async (req, res) => {
    try {
      const { projectId } = req.params;

      // Validate the project data
      const { error } = updateProjectSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      // Update project with the new data
      Object.assign(project, req.body);

      // Ensure projectMembers is an array
      if (!Array.isArray(project.projectMembers)) {
        project.projectMembers = [];
      }

      // Convert all string IDs in projectMembers to ObjectIds
      project.projectMembers = project.projectMembers.map(member => {
        return typeof member === 'string' ? new mongoose.Types.ObjectId(member) : member;
      });

      // Add the projectOwner to the projectMembers if not already included
      if (!project.projectMembers.includes(project.projectOwner.toString())) {
        project.projectMembers.push(project.projectOwner);
      }

      // If projectSlideImages is not an array, make it an empty one
      if (!Array.isArray(project.projectSlideImages)) {
        project.projectSlideImages = [];
      }

      // Convert received slideshowImage objects to array of Map with ObjectId values
      if (req.body.projectSlideImages) {
        project.projectSlideImages = req.body.projectSlideImages.map(slideImage => {
          let mapSlideImage = new Map();
          for (const [key, value] of Object.entries(slideImage)) {
            mapSlideImage.set(key, new mongoose.Types.ObjectId(value));
          }
          return mapSlideImage;
        });
      }

      const updatedProject = await project.save();

      res.status(200).json(updatedProject);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete a project by ID
  deleteProjectById: async (req, res) => {
    try {
      const { projectId } = req.params;
      const deletedProject = await Project.findByIdAndDelete(projectId).populate({
        path: 'projectOwner',
        select: '_id firstName lastName email'
      });
      if (!deletedProject) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Search projects
  searchProjects: async (req, res) => {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const skip = page && limit ? (page - 1) * limit : 0;

      const {
        projectName,
        projectType,
        projectStatus,
        projectPriceRange,
        projectLocation,
        projectCommission,
        projectOwner,
      } = req.query;

      const queryObject = {};

      if (projectName) queryObject.projectName = { $regex: projectName, $options: 'i' };
      if (projectType) queryObject.projectType = projectType;
      if (projectStatus) queryObject.projectStatus = projectStatus;

      if (projectPriceRange && projectPriceRange.minPrice !== undefined && projectPriceRange.minPrice !== '') {
        queryObject['projectPriceRange.minPrice'] = { $gte: projectPriceRange.minPrice };
      }
      if (projectPriceRange && (projectPriceRange.maxPrice !== undefined && projectPriceRange.maxPrice !== '')) {
        queryObject['projectPriceRange.maxPrice'] = { $lte: projectPriceRange.maxPrice };
      }

      if (projectLocation && projectLocation.locationName) {
        queryObject['projectLocation.locationName'] = { $regex: projectLocation.locationName, $options: 'i' };
      }
      if (projectLocation && projectLocation.suburb) {
        queryObject['projectLocation.suburb'] = { $regex: projectLocation.suburb, $options: 'i' };
      }
      if (projectLocation && projectLocation.region) {
        queryObject['projectLocation.region'] = { $regex: projectLocation.region, $options: 'i' };
      }
      if (projectLocation && projectLocation.postcode) {
        queryObject['projectLocation.postcode'] = projectLocation.postcode;
      }
      if (projectOwner !== undefined && projectOwner !== null && projectOwner !== '' && projectOwner !== '0') {
        queryObject.projectOwner = projectOwner;
      } else if (projectOwner === '0') {
        queryObject.projectOwner = '000000000000000000000000';
      }
      if (projectCommission && projectCommission.exists === 'true') {
        queryObject['projectCommission'] = { $exists: true };
        if (projectCommission.type) {
          if (projectCommission.type === 'fixed') {
            let amount = projectCommission.amount || 0;
            queryObject['projectCommission.type'] = 'fixed';
            queryObject['projectCommission.amount'] = { $gte: amount };
          }

          if (projectCommission.type === 'percentage') {
            let percent = projectCommission.percent || 0;
            queryObject['projectCommission.type'] = 'percentage';
            queryObject['projectCommission.percent'] = { $gte: percent };
          }
        }
      } else if (projectCommission && projectCommission.exists === 'false') {
        queryObject['projectCommission'] = { $exists: false };
      }

      const projectsQuery = Project.find(queryObject)
        .populate('projectOwner', '_id firstName lastName email')
        .sort({ createdAt: -1 });

      if (skip) {
        projectsQuery.skip(skip);
      }

      if (limit) {
        projectsQuery.limit(limit);
      }

      const projects = await projectsQuery.exec();

      const totalProjects = await Project.countDocuments(queryObject);

      res.status(200).json({
        projects,
        currentPage: page || 1,
        totalPages: limit ? Math.ceil(totalProjects / limit) : 1,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get users with projects
  getUsersWithProjects: async (req, res) => {
    try {
      const projectOwners = await Project.aggregate([
        {
          $group: {
            _id: '$projectOwner',
            count: { $sum: 1 },
          },
        },
        {
          $match: {
            count: { $gt: 0 },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'projectOwner',
          },
        },
        {
          $unwind: '$projectOwner',
        },
        {
          $project: {
            _id: 0,
            projectOwner: {
              _id: '$projectOwner._id',
              firstName: '$projectOwner.firstName',
              lastName: '$projectOwner.lastName',
              email: '$projectOwner.email',
              count: '$count',
            },
          },
        },
      ]);


      res.status(200).json(projectOwners);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get projects by owner
  getProjectsByOwner: async (req, res) => {
    try {
      const { ownerId } = req.params;
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const skip = page && limit ? (page - 1) * limit : 0;
      const search = req.query.search || '';
      const initialId = req.query.initialData;

      const queryObject = {
        projectOwner: ownerId,
        projectName: { $regex: search, $options: 'i' },
      };

      if (initialId) {
        const initialProject = await Project.findById(initialId);
        if (initialProject) {
          const initialProjectIndex = await Project.find(queryObject)
            .sort({ createdAt: -1 })
            .then(projects => projects.findIndex(project => project._id.toString() === initialId));
          res.locals.initialProjectPage = Math.ceil((initialProjectIndex + 1) / limit);
        }
      }

      const projectsQuery = Project.find(queryObject)
        .populate('projectOwner', '_id firstName lastName email')
        .sort({ createdAt: -1 });

      if (skip) {
        projectsQuery.skip(skip);
      }

      if (limit) {
        projectsQuery.limit(limit);
      }

      const projects = await projectsQuery.exec();

      const totalProjects = await Project.countDocuments(queryObject);

      res.status(200).json({
        projects,
        currentPage: page || 1,
        totalPages: limit ? Math.ceil(totalProjects / limit) : 1,
        initialProjectPage: res.locals.initialProjectPage,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },


  // Add members to a project
  addProjectMembers: async (req, res) => {
    try {
      const projectId = req.params.id;
      const userIds = Array.isArray(req.body) ? req.body : [req.body];

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const objectIds = userIds.map(id => new mongoose.Types.ObjectId(id));

      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
          $addToSet: { projectMembers: { $each: objectIds } },
        },
        { new: true }
      );

      res.json(updatedProject);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Remove members from a project
  removeProjectMembers: async (req, res) => {
    try {
      const projectId = req.params.id;
      const userIds = Array.isArray(req.body) ? req.body : [req.body];

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const objectIds = userIds.map(id => new mongoose.Types.ObjectId(id));

      if (objectIds.some(id => id.equals(project.projectOwner))) {
        return res.status(400).json({ message: "Cannot remove the owner of the group" });
      }

      const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        {
          $pullAll: { projectMembers: objectIds },
        },
        { new: true }
      );

      res.json(updatedProject);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = projectController;
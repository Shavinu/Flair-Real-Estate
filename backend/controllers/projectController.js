const mongoose = require('mongoose');
const Project = require('../models/projectModel');
const User = require('../models/userModel');
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
      
          // Ensure projectMembers is an array
          if (!Array.isArray(newProject.projectMembers)) {
            newProject.projectMembers = [];
          }
      
          // Add the projectOwner to the projectMembers if not already included
          if (!newProject.projectMembers.includes(newProject.projectOwner.toString())) {
            newProject.projectMembers.push(newProject.projectOwner);
          }
      
          // Convert projectOwner to ObjectId
          newProject.projectOwner = new mongoose.Types.ObjectId(newProject.projectOwner);
      
          // Convert projectMembers to ObjectIds
          newProject.projectMembers = newProject.projectMembers.map(memberId =>
            new mongoose.Types.ObjectId(memberId)
          );
      
          const savedProject = await newProject.save();
          res.status(201).json(savedProject);
        } catch (error) {
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
            const project = await Project.findById(projectId).populate('projectOwner');
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
            const deletedProject = await Project.findByIdAndDelete(projectId);
            if (!deletedProject) {
                return res.status(404).json({ message: 'Project not found' });
            }
            res.status(200).json({ message: 'Project deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get projects by owner
    getProjectsByOwner: async (req, res) => {
        try {
            const { ownerId } = req.params;
            const projects = await Project.find({ projectOwner: ownerId }).populate('projectOwner');
            res.status(200).json(projects);
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
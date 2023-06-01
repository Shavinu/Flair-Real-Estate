const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Create a new project
// POST /api/projects
// Request body: { projectName, projectType, projectPriceRange, projectDescription, projectLocation, 
// projectFiles (optional), projectListings (optional), projectOwner, projectMembers (optional), projectStatus }
router.post('/', projectController.createProject);

// Get all projects
// GET /api/projects
router.get('/', projectController.getAllProjects);

// Get a project by ID
// GET /api/projects/:projectId
router.get('/:projectId', projectController.getProjectById);

// Update a project by ID
// PUT /api/projects/:projectId
// Request body: { projectName (optional), projectType (optional), projectPriceRange (optional), 
//      projectDescription (optional), projectLocation (optional), projectFiles (optional), projectListings (optional), projectOwner (optional), projectMembers (optional), projectStatus (optional) }
router.post('/:projectId', projectController.updateProjectById);

// Delete a project by ID
// DELETE /api/projects/:projectId
router.delete('/:projectId', projectController.deleteProjectById);

// Get projects by owner
// GET /api/projects/owner/:ownerId
router.get('/owner/:ownerId', projectController.getProjectsByOwner);

// Add project members (Appends)
// PATCH /api/projects/:id/add-members
//  To add a single member: { ["oioioi"] }
//  To add multiple members: { ["oioioi", "oioioi"] }
router.patch('/:id/add-members', projectController.addProjectMembers);

// Remove project members (Pull)
// PATCH /api/projects/:id/remove-members
//  To remove a single member: { ["oioioi"] }
//  To remove multiple members: { ["oioioi", "oioioi"] }
router.patch('/:id/remove-members', projectController.removeProjectMembers);

module.exports = router;

const express = require('express')
const router = express.Router()
const {
  createGroup,
  updateGroup,
  deleteGroup,
  getGroup,
  getGroups,
  addUserToGroup,
  addManyUsersToGroup,
  getGroupsBySearch,
  getUsersInGroup,
  deleteUserFromGroup,
  getAvailableUsers,
  removeManyUsersFromGroup,
  deleteManyGroups,
  getSubGroups
} = require('../controllers/groupController')

//create group
//body should contain groupType, groupLicence, groupName, groupContact, groupEmail, groupArea in json
router.post('/createGroup', createGroup)

//update group
//body should contain groupId, and the fields to be updated in json
router.put('/updateGroup', updateGroup)

//delete group
//body should contain groupId
router.post('/deleteGroup', deleteGroup)

//get group
//id is the group object id
router.get('/getGroup/:id', getGroup)

//get sub groups by id
router.post('/subGroups', getSubGroups)

//get all groups
router.get('/getGroups', getGroups)

//search groups
//searchQuery is the search query in json, eg. 'groupName:name_of_group', it will return all groups with that name
router.post('/getGroupsBySearch', getGroupsBySearch)

//add user to group
//body should contain userId and groupId
router.post('/addUserToGroup', addUserToGroup)

//add many users to group
//body should contain userId and groupId
router.post('/addManyUsersToGroup', addManyUsersToGroup)

//get all users in group
//body should contain groupId
router.post('/getUsersInGroup', getUsersInGroup)

//delete user from group
//body should contain userId
router.post('/deleteUserFromGroup', deleteUserFromGroup)

router.get('/getAvailableUsers', getAvailableUsers)

router.post('/removeManyUsersFromGroup', removeManyUsersFromGroup)

router.post('/deleteManyGroups', deleteManyGroups)

module.exports = router

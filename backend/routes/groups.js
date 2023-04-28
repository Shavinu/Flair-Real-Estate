const express = require('express')
const router = express.Router()
const {
    createGroup,
    updateGroup,
    deleteGroup,
    getGroup,
    addUserToGroup,
    getGroupsBySearch,
    getUsersInGroup,
    deleteUserFromGroup
} = require('../controllers/groupController')

router.get('/', getGroup);

//create group
//body should contain groupType, groupLicence, groupName, groupContact, groupEmail, groupArea in json
router.post('/createGroup', createGroup)

//update group
//body should contain groupId, and the fields to be updated in json
router.post('/updateGroup', updateGroup)

//delete group
//body should contain groupId
router.post('/deleteGroup', deleteGroup)

//get group
//id is the group object id
router.get('/getGroup/:id', getGroup)

//search groups
//searchQuery is the search query in json, eg. 'groupName:name_of_group', it will return all groups with that name
router.post('/getGroupsBySearch', getGroupsBySearch)

//add user to group
//body should contain userId and groupId
router.post('/addUserToGroup', addUserToGroup)

//get all users in group
//body should contain groupId
router.post('/getUsersInGroup', getUsersInGroup)

//delete user from group
//body should contain userId
router.post('/deleteUserFromGroup', deleteUserFromGroup)

module.exports = router

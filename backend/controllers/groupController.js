const { response } = require('express');
const Group = require('../models/groupModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const createError = require('http-errors');

//create group and add current user to group
const createGroup = async (req, res) => {
  const { groupType, groupLicence, groupName, groupContact, groupEmail, groupArea } = req.body;
  try {
    const existingGroup = await Group.findOne({ groupLicence: groupLicence });

    if (existingGroup) {
      createError.BadRequest(`${req.body.groupLicence} is already registered!`);
      return res.status(400).json({ error: `"${req.body.groupLicence}" license is already registered!` });
    }

    const group = await Group.create({ groupType, groupLicence, groupName, groupContact, groupEmail, groupArea });

    res.status(200).json(group);

  } catch (error) {
    res.status(400).json({ error: 'Cannot create group' });
    console.log(error);
  }
}

//update group
const updateGroup = async (req, res) => {
  const { _id, groupType, groupLicence, groupName, groupContact, groupEmail, groupArea } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: 'Not valid group ID' });
  }

  try {
    const existingGroup = await Group.findOne({ groupLicence: groupLicence, _id: { $ne: _id } });

    if (existingGroup) {
      createError.BadRequest(`${groupLicence} is already registered!`);
      return res.status(400).json({ error: `"${groupLicence}" license is already registered!` });
    }

    const updatedGroup = await Group.findOneAndUpdate(
      { _id: _id },
      { groupType, groupLicence, groupName, groupContact, groupEmail, groupArea },
      { new: true }
    );

    res.status(200).json(updatedGroup);

  } catch (error) {
    res.status(400).json({ error: 'cannot update group' });
    console.log(error);
  }
};

//get single group
const getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'No group found' });
    }
    res.status(200).json(group);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Unable to get group' });
  }
}

//get all groups
const getGroups = async (req, res) => {
  try {
    const groups = await Group.find().sort({ CreateAt: -1 });
    res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Unable to get groups' });
  }
};

//delete group
const deleteGroup = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.body.id)) {
      return res.status(400).json({ error: 'Not a valid ID' });
    }

    await Group.findByIdAndRemove(req.body.id);

    //remove group from users
    await User.updateMany({ group: req.body.id }, { $unset: { group: null } });

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Unable to delete group' });
  }
};


//get all groups matching search query
const getGroupsBySearch = async (req, res) => {
  try {
    const { groupType, groupLicence, groupName, groupContact, groupEmail, groupArea } = req.body;

    const searchParams = Object.entries({
      groupType,
      groupLicence,
      groupName,
      groupContact,
      groupEmail,
      groupArea
    }).filter(([key, value]) => value);

    const searchQuery = searchParams.reduce((query, [key, value]) => {
      query[key] = value;
      return query;
    }, {});

    const groups = await Group.find({ $or: [searchQuery] });

    res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Unable to get groups' });
  }
};


//get all users in a group
const getUsersInGroup = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.body._id)) {
      return res.status(404).json({ error: 'Not a valid ID' });
    }

    const users = await User.find({ group: req.body._id }).sort({ CreateAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to get users in group' });
  }
};

//add user to group
const addUserToGroup = async (req, res) => {
  try {
    const { userId, groupId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ error: 'Invalid userId or groupId' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'No user found' });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'No group found' });
    }

    user.group = group._id;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Cannot add user to group' });
    console.log(error);
  }
};

//delete user from group
const deleteUserFromGroup = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
      return res.status(404).json({ error: 'Not a valid ID' });
    }

    const user = await User.findOneAndUpdate({ _id: req.body.userId }, { $unset: { group: null } }, { new: true });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete user from group' });
  }
}

const getAvailableUsers = async (req, res) => {
  try {
    const users = await User.find({ group: null });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Unable to get users' });
  }
}

const removeManyUsersFromGroup = async (req, res) => {
  try {
    const { ids } = req.body;
    const users = await User.updateMany({ _id: { $in: ids } }, { $set: { group: null } });
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Unable to delete users from group' });
  }
}

module.exports = {
  createGroup,
  updateGroup,
  deleteGroup,
  getGroup,
  getGroups,
  addUserToGroup,
  getGroupsBySearch,
  getUsersInGroup,
  deleteUserFromGroup,
  getAvailableUsers,
  removeManyUsersFromGroup,
}

const { response } = require('express');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const createError = require('http-errors');
const JWT = require('jsonwebtoken');
const { authSchema } = require('../helpers/validation');
const { signAccessToken, verifyAccessToken } = require('../helpers/token');
const { userSchema } = require('../helpers/validation');

//get all users
const getUsers = async (req, res) => {
  const users = await User.find().sort({ CreateAt: -1 });

  res.status(200).json(users);
};

//get single user
const getaUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Not a vaild ID' });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ error: 'No user found' });
  }

  res.status(200).json(user);
};

//create/register a new user
const createUser = async (req, res) => {
  try {
    const validatedResult = await userSchema.validateAsync(req.body);

    const existingUser = await User.findOne({ email: validatedResult.email })
    if (existingUser) throw createError.BadRequest(`${validatedResult.email} is already registered!`)

    const user = new User(validatedResult);
    user.password = user.generateHash(validatedResult.password)
    const savedUser = await user.save();
    res.status(200).json(savedUser)
  } catch (error) {
    res.status(400).json({ error: 'cannot create user' })
    console.log(error)
  }
}

//delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'NoT a Vaild id' });
  }

  const user = await User.findOneAndDelete({ _id: id });

  if (!user) {
    return res.status(404).json({ error: 'no user found' });
  }

  res.status(200).json(user);
};

//update user
const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Not a valid id' });
  }

  const user = await User.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!user) {
    return res.status(404).json({ error: 'no user found' });
  }

  if (req.body.password) {
    user.password = user.generateHash(req.body.password)
    user.save();
  }

  res.status(200).json(user);
};

const deleteManyUsers = async (req, res) => {
  const { ids } = req.body;
  const users = await User.deleteMany({ _id: { $in: ids } });
  res.status(200).json(users);
}

module.exports = {
  getUsers,
  getaUser,
  createUser,
  deleteUser,
  updateUser,
  deleteManyUsers,
};

const { response } = require('express');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const createError = require('http-errors');
const JWT = require('jsonwebtoken');
const { authSchema } = require('../helpers/validation');
const { signAccessToken, verifyAccessToken } = require('../helpers/token');

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
  const { accType, firstName, lastName, phoneNo, email, password } = req.body
  try {
    const existingUser = await User.findOne({ email: user.email })
    if (!existingUser) throw createError.BadRequest(`${req.body.password} is already registered!`)

    const user = await User.create({ accType, firstName, lastName, phoneNo, email, password })

    user.password = user.generateHash(req.body.password)
    user.save()
    const { accessToken, payload } = await signAccessToken(user.id, user.email);
    res.status(200).json({ user, accessToken, payload })
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
    return res.status(404).json({ error: 'NoT a Vaild id' });
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

  res.status(200).json(user);
};

module.exports = {
  getUsers,
  getaUser,
  createUser,
  deleteUser,
  updateUser,
};

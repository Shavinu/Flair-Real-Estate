const { response } = require('express');
const User = require('../models/userModel');
const UserVerification = require('../models/tokens');
const mongoose = require('mongoose');
const createError = require('http-errors');
const JWT = require('jsonwebtoken');
const { requestChangeSchema } = require('../helpers/validation');
const { signAccessToken, verifyAccessToken } = require('../helpers/token');
const { userSchema } = require('../helpers/validation');
const Token = require('../models/requestChangeTokens');
const sendEmail = require('./sendEmailController');
const crypto = require('crypto');

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

    const existingUser = await User.findOne({ email: validatedResult.email });
    if (existingUser)
      throw createError.BadRequest(
        `${validatedResult.email} is already registered!`
      );

    const user = new User(validatedResult);
    user.password = user.generateHash(validatedResult.password);
    const savedUser = await user.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: 'cannot create user' });
    console.log(error);
  }
};

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

  if (req.body?.password) {
    user.password = user.generateHash(req.body.password);
    user.save();
  }

  res.status(200).json(user);
};

const deleteManyUsers = async (req, res) => {
  const { ids } = req.body;
  const users = await User.deleteMany({ _id: { $in: ids } });
  res.status(200).json(users);
};

const requestChange = async (req, res, next) => {
  try {
    const validatedResult = await requestChangeSchema.validateAsync(req.body);

    const user = await User.findOne({ _id: validatedResult.userId });
    if (!user)
      throw createError.UnprocessableEntity('User does not exist');

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex'),
        company: req.body.company,
      }).save();
      const subject = 'Requested Change';
      const url = `${process.env.REACT_APP_PUBLIC_URL}/users/request-change/${user._id}/${token.token}/${token.company.replaceAll(' ', '-')}`;
      const html = `<p>User ${user.firstName} ${user.lastName} requests a company change.</p>
      <p>Press <a href=${url}>here</a> to view request.</p>`;

      await sendEmail(process.env.MOD_EMAIL, process.env.ADMIN_EMAIL, subject, html);
    }
    return res
      .status(201)
      .send({ message: 'Your request has been sent. Please allow 48 hours for the request to be approved' });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

// verify request link is valid
const verifyRequest = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    if (!user) throw createError.UnprocessableEntity('User does not exist');

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
      company: req.params.company.replaceAll('-', ' ')
    });
    if (!token) throw createError.BadRequest('Invalid Link');

    res.status(200).send({ message: 'Valid URL' });
  } catch (error) {
    error.status = 500;
    next(error);
  }
}

// delete request token
const deleteToken = async (req, res, next) => {
  try {
    const token = await Token.findOne({
      userId: req.body.userId,
      token: req.body.token,
      company: req.body.company,
    });
    if (!token) throw createError.BadRequest('Invalid Link');

    const deleteToken = await Token.findOneAndDelete({ _id: token._id });
    if (!deleteToken)
      return res.status(400).send({ message: 'Unable to delete token' });

  } catch (error) {
    error.status = 500;
    next(error);
  }
}

//Approve user
const approveUser = async (req, res) => {
  try{
  const { id } = req.body;
  const filter = {_id: id};
  //console.log('Received ID:', id);
  const update = { verified: true };
  const approvedUser = await User.findOneAndUpdate(filter, update, {
    new: true
  });

  if (!approvedUser) {
    return res.status(404).json({ message: 'User not found or could not be updated.' });
  }

  res.status(200).json(approvedUser);
  //res.status(200).json({ message: "User Approved!" });
  }
  catch (error)
  {
    res.status(500).json({ message: 'An error occurred while approving the user.' });
  }
};


// const addFavoriteListing = async (req, res) => {
//   try {
//     const { userId, listingId } = req.body;
//     // Find the user by their ID
//     const addUserFavourites = await User.findById(userId);

//     if (!addUserFavourites) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     // Add the listing ID to the favorites array
//     addUserFavourites.favorites.listings.push(listingId);

//     // Save the updated user document
//     const updatedUser = await addUserFavourites.save();

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     res.status(500).json({ message: 'An error occurred while adding the favorite listing.' });
//   }
// };

const favouriteUser = async (req, res) => {
  try {
    const { id, projectId, listingId } = req.body;

    // Find the user by their ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (projectId) {
      // Add the project ID to the favorite projects array
      //user.favorites.projects.push(projectId);
      user.favorites.projects = [...new Set(user.favorites.projects.concat(projectId))];
    }

    if (listingId) {
      // Add the listing ID to the favorite listings array
      //user.favorites.listings.push(listingId);
      user.favorites.listings = [...new Set(user.favorites.listings.concat(listingId))];
    }

    // Save the updated user document
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while adding the favorite.' });
  }
};

const favouriteUserDelete = async (req, res) => {
  try {
    const { userId, favoriteType, favoriteId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(favoriteId)) {
      return res.status(404).json({ error: 'Invalid Favourites IDs' });
    }

    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Determine whether to delete from listings or projects array
    if (favoriteType === 'listings') {
      user.favorites.listings = user.favorites.listings.filter(id => id !== favoriteId);
    } else if (favoriteType === 'projects') {
      user.favorites.projects = user.favorites.projects.filter(id => id !== favoriteId);
    } else {
      return res.status(400).json({ error: 'Invalid favoriteType' });
    }

    // Save the updated user document
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting from favorites.' });
  }
};


module.exports = {
  getUsers,
  getaUser,
  createUser,
  deleteUser,
  updateUser,
  deleteManyUsers,
  requestChange,
  verifyRequest,
  deleteToken,
  approveUser,
  favouriteUser,
  favouriteUserDelete,
};

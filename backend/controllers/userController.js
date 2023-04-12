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
const createUser = async (req, res) =>{
    const {accType, firstName, lastName, phoneNo, email, password} = req.body
    try{
        const user = await User.create({accType, firstName, lastName, phoneNo, email, password})

        const existingUser = await User.findOne(user.email)
        if (existingUser) throw createError.BadRequest(`${req.body.password} is already registered!`)

        user.password = user.generateHash(req.body.password)
        user.save()
        const { accessToken, payload } = await signAccessToken(savedUser.id, savedUser.email);
        res.status(200).json({ user, accessToken, payload })
    } catch (error) {
        res.status(400).json({ error: 'cannot create user' })
        console.log(error)
    }
}


//verfiy login for user
const loginUser = async (req, res) => {

    const validatedResult = await authSchema.validateAsync(req.body);

    const user = await User.findOne(
        { email: validatedResult.email },
        async function (err, user) {
            //if email dosent match
            if (!user) {
                return res.status(404).json({ error: 'email not found' });
            }

            if (!user.validPassword(validatedResult.password)) {
                //passwords dont match
                return res.status(404).json({ error: 'incorrect password' });
            } else {
                //passwords match
                const { accessToken, payload } = await signAccessToken(user.id, user.email);
                res.status(200).json(user);
            }
        }
    );
};

//get current user session 
const getCurrentUser = async (req, res, next) => {
    try {
      if (!req.headers || !req.headers['authorization']) {
        throw createError.Unauthorized();
      }
  
      const authHeader = req.headers['authorization'];
      const bearerToken = authHeader.split(' ');
      const token = bearerToken[1];
  
      const payload = await JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
          console.log(err);
          return next(createError.Unauthorized());
        }
  
        return payload;
      });
  
      const user = await User.findOne({ _id: payload._id })
      res.json(user)
  
    } catch (error) {
      next(error);
    }
  }
  
  //logout a user
  const logoutUser = async (req, res, next) => {
    try {
      const { accessToken } = req.body;
      if (!accessToken) throw createError.Unauthorized();
  
    } catch (error) {
  
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
    loginUser,
    getCurrentUser,
    logoutUser,
    deleteUser,
    updateUser,
};

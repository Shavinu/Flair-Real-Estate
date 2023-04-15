const createError = require('http-errors');
const JWT = require('jsonwebtoken');
const User = require('../models/userModel');
const { userSchema, authSchema } = require('../helpers/validation');
const { signAccessToken, verifyAccessToken } = require('../helpers/token');

const register = async (req, res, next) => {
  try {
    const validatedResult = await userSchema.validateAsync(req.body);

    const existingUser = await User.findOne({ email: validatedResult.email })
    if (existingUser) throw createError.BadRequest(`${validatedResult.email} is already registered!`);

    const user = new User(validatedResult);
    user.password = user.generateHash(validatedResult.password)
    const savedUser = await user.save();
    const { accessToken, payload } = await signAccessToken(savedUser.id, savedUser.email);

    res.status(200).json({ accessToken, payload });
  } catch (error) {
    if (error.isJoi === true) error.status = 422
    next(error);
  }
}

const login = async (req, res, next) => {
  try {
    const validatedResult = await authSchema.validateAsync(req.body);

    const user = await User.findOne({ email: validatedResult.email });
    if (!user) throw createError.UnprocessableEntity('Incorrect email or password. ');

    const isMatch = await user.validPassword(validatedResult.password);

    if (!isMatch) throw createError.Unauthorized('Email or password is invalid');

    const { accessToken, payload } = await signAccessToken(user.id, user.email);

    res.status(200).json({ accessToken, payload });
  } catch (error) {
    if (error.isJoi === true) error.status = 422
    next(error);
  }
}

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

const logout = async (req, res, next) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) throw createError.Unauthorized();

  } catch (error) {

  }
}

module.exports = {
  register,
  login,
  getCurrentUser,
}

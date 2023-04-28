const createError = require('http-errors');
const JWT = require('jsonwebtoken');
const User = require('../models/userModel');
const { userSchema, authSchema, validateSchema } = require('../helpers/validation');
const { signAccessToken, verifyAccessToken } = require('../helpers/token');
const { verifyLicence } = require('./verifyLicenceController')

const register = async (req, res, next) => {
  try {
    const validatedResult = await userSchema.validateAsync(req.body);

    // check if user already exists
    const existingUser = await User.findOne({ email: validatedResult.email })
    if (existingUser) throw createError.BadRequest(`${validatedResult.email} is already registered!`);

    // check if licence already exists
    const existingLicence = await User.findOne({ licence: validatedResult.licence })
    if (existingLicence) throw createError.BadRequest(`Licence ${validatedResult.licence} is already registered!`);

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

//verify licence
const verifyLicenceNumber = async (req, res, next) => {
  try {
    const validatedResult = await validateSchema.validateAsync(req.params);
    const idType = validatedResult.accType;
    const id = validatedResult.licence;

    const mockReq = { params: { idType, id } };
    const mockRes = {
      status: function (statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      json: function (data) {
        this.data = data;
        return this;
      },
    };

    await verifyLicence(mockReq, mockRes);

    if (mockRes.statusCode === 404) {
      throw createError.BadRequest(`Licence ${validatedResult.licence} - ${mockRes.data.message}`);
    }

    if (mockRes.statusCode === 200) {
      res.status(200).json(mockRes.data);
    }
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

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
  verifyLicenceNumber,
  login,
  getCurrentUser,
}

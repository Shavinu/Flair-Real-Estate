const createError = require('http-errors');
const JWT = require('jsonwebtoken');
const User = require('../models/userModel');
const Token = require('../models/tokens');
require('dotenv').config();
const {
  userSchema,
  authSchema,
  validateSchema,
  forgotPassSchema,
  updatePassSchema,
} = require('../helpers/validation');
const { signAccessToken, verifyAccessToken } = require('../helpers/token');
const { verifyLicence } = require('./verifyLicenceController');
const sendEmail = require('./sendEmailController');
const crypto = require('crypto');

const register = async (req, res, next) => {
  try {
    const validatedResult = await userSchema.validateAsync(req.body);

    // check if user already exists
    let existingUser = await User.findOne({ email: validatedResult.email });
    if (existingUser)
      throw createError.BadRequest(
        `${validatedResult.email} is already registered!`
      );

    // check if licence already exists
    const existingLicence = await User.findOne({
      licence: validatedResult.licence,
    });
    if (existingLicence)
      throw createError.BadRequest(
        `Licence ${validatedResult.licence} is already registered!`
      );

    const user = new User(validatedResult);
    user.password = user.generateHash(validatedResult.password);
    await user.save();

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex'),
    }).save();
    const subject = 'Verify Email';
    const url = `${process.env.REACT_APP_PUBLIC_URL}/auth/verify/${user._id}/${token.token}`;
    const html = `<p>Verify your email address to cocmplete the signup process and login into your account.</p><p>This link
        <b>expires in 1 hour.</b></p><p>Press <a href=${url}>here</a> to proceed.</p>`;

    await sendEmail(process.env.MOD_EMAIL, user.email, subject, html);

    res.status(201).send({
      message:
        'An Email has been sent to your address. Please verify your account',
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    if (!user) throw createError.UnprocessableEntity('User does not exist');

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) throw createError.BadRequest('Invalid Link');

    const savedUser = await User.updateOne(
      { _id: user._id },
      { verified: true }
    );
    if (!savedUser)
      throw createError.InternalServerError('Internal Server Error');

    const deleteToken = await Token.findOneAndDelete({ _id: token._id });
    if (!deleteToken) {
      return res.status(400).send({ message: 'Unable to delete token' });
    }

    const { accessToken, payload } = await signAccessToken(user.id, user.email);

    res
      .status(200)
      .send({ accessToken, payload, message: 'Email verified successfully' });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const validatedResult = await authSchema.validateAsync(req.body);

    const user = await User.findOne({ email: validatedResult.email });
    if (!user) throw createError.UnprocessableEntity('User does not exist');

    const isMatch = await user.validPassword(validatedResult.password);

    if (!isMatch)
      throw createError.Unauthorized('Email or password is incorrect');

    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString('hex'),
        }).save();
        const subject = 'Verify Email';
        const url = `${process.env.REACT_APP_PUBLIC_URL}/auth/verify/${user._id}/${token.token}`;
        const html = `<p>Verify your email address to cocmplete the signup process and login into your account.</p><p>This link
            <b>expire in 1 hour.</b></p><p>Press <a href=${url}>here</a> to proceed.</p>`;

        await sendEmail(process.env.MOD_EMAIL, user.email, subject, html);
      }
      return res
        .status(201)
        .send({
          message: 'An Email sent to your address. Please verify your account',
        });
    }

    const { accessToken, payload } = await signAccessToken(user.id, user.email);

    res.status(200).send({ accessToken, payload });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const validatedResult = await forgotPassSchema.validateAsync(req.body);

    const user = await User.findOne({ email: validatedResult.email });
    if (!user)
      throw createError.UnprocessableEntity('No user exists with this email');

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex'),
      }).save();
      const subject = 'Password Reset';
      const url = `${process.env.REACT_APP_PUBLIC_URL}/auth/reset-password/${user._id}/${token.token}`;
      const html = `<p>Reset your password using the following link.</p><p>This link
        <b>expires in 1 hour.</b></p><p>Press <a href=${url}>here</a> to proceed.</p>`;

      await sendEmail(process.env.MOD_EMAIL,user.email, subject, html);
    }
    return res
      .status(201)
      .send({ message: 'A password reset link has been sent to your email' });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

// verify reset password url
const resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    if (!user) throw createError.UnprocessableEntity('User does not exist');

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) throw createError.BadRequest('Invalid Link');

    res.status(200).send({ message: 'Valid URL' });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

// update password after reset
const updatePassword = async (req, res, next) => {
  try {
    const validatedResult = await updatePassSchema.validateAsync(req.body);

    // check if user exists
    const user = await User.findOne({ _id: validatedResult.userId });
    if (!user) throw createError.UnprocessableEntity('Uer does not exist');

    const token = await Token.findOne({
      userId: user._id,
      token: validatedResult.token,
    });
    if (!token) throw createError.BadRequest('Invalid Link');

    if (!user.verified) user.verified = true;
    user.password = user.generateHash(validatedResult.password);
    await user.save();

    const deleteToken = await Token.findOneAndDelete({ _id: token._id });
    if (!deleteToken) {
      return res.status(400).send({ message: 'Unable to delete token' });
    }
    res.status(200).send({ message: 'Password has been updated successfully' });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

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
      throw createError.BadRequest(
        `Licence ${validatedResult.licence} - ${mockRes.data.message}`
      );
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

    const payload = await JWT.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, payload) => {
        if (err) {
          console.log(err);
          return next(createError.Unauthorized());
        }

        return payload;
      }
    );

    const user = await User.findOne({ _id: payload._id });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) throw createError.Unauthorized();
  } catch (error) {}
};

module.exports = {
  register,
  verifyLicenceNumber,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  getCurrentUser,
};

const createError = require('http-errors');
const User = require('../models/userModel');
const { userSchema, authSchema } = require('../helpers/validation');
const { signAccessToken } = require('../helpers/token');

const register = async (req, res, next) => {
    try {
        const validatedResult = await userSchema.validateAsync(req.body);

        const existingUser = await User.findOne({ email: validatedResult.email })
        if (existingUser) throw createError.BadRequest(`${validatedResult.email} is already registered!`);

        const user = new User(validatedResult);
        const savedUser = await user.save();
        const accessToken = await signAccessToken(savedUser.id)

        res.status(200).json({ accessToken });
    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const validatedResult = await authSchema.validateAsync(req.body);

        const user = await User.findOne({ email: validatedResult.email });
        if (!user) throw createError.NotFound('User not found');

        const isMatch = await user.validPassword(validatedResult.password);

        if (!isMatch) throw createError.Unauthorized('Email or password is invalid');

        const accessToken = await signAccessToken(user.id);

        res.status(200).json({ accessToken });
    } catch (error) {
        if (error.isJoi === true) error.status = 422
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
}

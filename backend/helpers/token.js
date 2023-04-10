const JWT = require('jsonwebtoken');
const createError = require('http-errors');

const signAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            name: "",
        };

        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: '1d',
            audience: userId,
        };

        JWT.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.log(err.message);
                return reject(createError.InternalServerError());
            }
            resolve(token);
        });
    })
}

const verifyAccessToken = async (req, res, next) => {
    if (!req.headers['authorization']) return next(createError.Unauthorized());

    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1]
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            console.log(err);
            return next(createError.Unauthorized());
        }

        req.payload = payload;
        next();
    })
}

module.exports = {
    signAccessToken,
    verifyAccessToken,
}

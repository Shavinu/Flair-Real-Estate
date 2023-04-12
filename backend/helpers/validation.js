const Joi = require('@hapi/joi');
/** 
const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNo: Joi.string().required(),
});
*/

const authSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})


module.exports = {
    //userSchema,
    authSchema,
}

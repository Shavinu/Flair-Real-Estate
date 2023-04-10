const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt');

/*  A user is anyone who is logged in, admins, devlopers, agents, etc
*   the accType or account type feild dictates the privlges that user has
*/
const userSchema = new Schema({
    // accType: {
    //     type: String,
    //     required: true
    // },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'Please enter an email'],
        validate: []
    },
    password: {
        type: String,
        required: true
    }

}, { timestamps: true })

//static signup method
userSchema.statics.signup = async (accType, firstName, lastName, phoneNo, email, password) => {
    const exists = await this.findOne({ email })

    if (exists) {
        throw Error('Email already in use')
    }


}

// hash the password
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.pre('save', async function (next) {
    try {
        const hashedPassword = await this.generateHash(this.password);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
})

module.exports = mongoose.model('User', userSchema)

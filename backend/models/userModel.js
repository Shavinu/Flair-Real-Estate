const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt');

/*  A user is anyone who is logged in, admins, devlopers, agents, etc
*   the accType or account type feild dictates the privlges that user has
*/
const userSchema = new Schema({
    accType: {
        type: String,
        required: true
    },
    fistName: {
        type: String,
        required: true 
    },
    lastName: {
        type: String,
        required: true 
    },
    phoneNo: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true 
    },
    password: {
        type: String,
        required: true
    }

}, { timestamps: true})

// hash the password
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
  
// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema)


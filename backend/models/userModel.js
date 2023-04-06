const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    //is the licensing feild a number or string??
    licensingNo: {
        type: Number,
        required: false
    }

}, { timestamps: true})

module.exports = mongoose.model('User', userSchema)


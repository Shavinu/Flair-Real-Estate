const { response } = require('express')
const User = require('../models/userModel')
const mongoose = require('mongoose')

//get all users
const getUsers = async (req, res) =>{
    // res.json({msg: "GET all users"})
    const users = await User.find().sort({CreateAt: -1})

    res.status(200).json(users)
}


//get single user
const getaUser = async (req, res) => {
  // res.json({msg: "GET a user"})
    const { id } = req.params
if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({error: 'NoT a Vaild id'})
}

    const user = await User.findById(id)

    if(!user){
        return res.status(404).json({error: 'no user found'})
    }

    res.status(200).json(user)
}


//create new user
const createUser = async (req, res) =>{
  // res.json({msg: "POST a user"})
    const {fistName, lastName, email} = req.body

    try{
        const user = await User.create({fistName, lastName, email})
        res.status(200).json(user)
    }catch (error){
        res.status(400).json({error: error.message})
    }
}

//delete user


//update user



module.exports = {
    getUsers,
    getaUser,
    createUser
}

const { response } = require('express')
const User = require('../models/userModel')
const mongoose = require('mongoose')

//get all users
const getUsers = async (req, res) =>{
    const users = await User.find().sort({CreateAt: -1})

    res.status(200).json(users)
}


//get singal user
const getaUser = async (req, res) => {
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
    const {fistName, lastName, email} = req.body

    try{
        const user = await User.create({fistName, lastName, email})
        res.status(200).json(user)
    }catch (error){
        res.status(400).json({error: error.message})
    }
}

//delete user
const deleteUser = async (req, res) => {
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'NoT a Vaild id'})
    }

    const user = await User.findOneAndDelete({_id: id})

    if(!user){
        return res.status(404).json({error: 'no user found'})
    }

    res.status(200).json(user)
}

//update user
const updateUser = async (req, res) =>{
    const { id } = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'NoT a Vaild id'})
    }

    const user = await User.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if(!user){
        return res.status(404).json({error: 'no user found'})
    }

    res.status(200).json(user)
}


module.exports = {
    getUsers,
    getaUser,
    createUser,
    deleteUser,
    updateUser
}
const { response } = require('express');
const User = require('../models/userModel');
const mongoose = require('mongoose');

//get all users
const getUsers = async (req, res) => {
    // res.json({msg: "GET all users"})
    const users = await User.find().sort({ CreateAt: -1 });

    res.status(200).json(users);
};

//get single user
const getaUser = async (req, res) => {
    // res.json({msg: "GET a user"})
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Not a vaild ID' });
    }

    const user = await User.findById(id);

    if (!user) {
        return res.status(404).json({ error: 'No user found' });
    }

    res.status(200).json(user);
};

//create new user
const createUser = async (req, res) =>{
    const {accType, firstName, lastName, phoneNo, email, password} = req.body

    try{
        const user = await User.create({accType, firstName, lastName, phoneNo, email, password})
        user.password = user.generateHash(req.body.password)
        user.save()
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ error: 'cannot create user' })
        console.log(error)
    }
}


//verfiy login for user
const loginUser = async (req, res) => {
    // res.json({msg: 'login user'})
    const user = await User.findOne(
        { email: req.body.email },
        function (err, user) {
            //if email dosent match
            if (!user) {
                return res.status(404).json({ error: 'email not found' });
            }

            if (!user.validPassword(req.body.password)) {
                //passwords dont match
                return res.status(404).json({ error: 'incorrect password' });
            } else {
                //passwords match
                res.status(200).json(user);
            }
        }
    );
};

//delete user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'NoT a Vaild id' });
    }

    const user = await User.findOneAndDelete({ _id: id });

    if (!user) {
        return res.status(404).json({ error: 'no user found' });
    }

    res.status(200).json(user);
};

//update user
const updateUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'NoT a Vaild id' });
    }

    const user = await User.findOneAndUpdate(
        { _id: id },
        {
            ...req.body,
        }
    );

    if (!user) {
        return res.status(404).json({ error: 'no user found' });
    }

    res.status(200).json(user);
};

module.exports = {
    getUsers,
    getaUser,
    createUser,
    loginUser,
    deleteUser,
    updateUser,
};

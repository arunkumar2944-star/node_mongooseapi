// routes/itemRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Security = require('../securities/security');
// GET: Fetch all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//GET:User Login
router.post('/login', async (req, res) => {

    try {

        const user = await User.findOne({
            email: req.body.email,
        });
        const isMatch = await Security.Compare(req.body.password,user.password)
        if (isMatch) {
            console.log('Password match')
        }
        if (!user && !isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: user
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// POST: Create a new user
router.post('/', async (req, res) => {

//    let encryptpwd=security.Encrypt(req.body.password);
    const newUser = new User({
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        phoneNo: req.body.phoneNo,
        email: req.body.email,
        type:req.body.type,
        password:await Security.EncryptString(req.body.password),
        createdAt: Date.now(),
        isActive:true
    });

    try {
        console.log(newUser)
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT: Update an existing user by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Remove an user by ID
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

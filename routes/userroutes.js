// routes/itemRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Security = require('../securities/security');
const jwt = require('jsonwebtoken');
const auth = require('../securities/middleware/auth')
// GET: Fetch all users
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//POST:User Login
router.post('/login', async (req, res) => {

    try {

        const user = await User.findOne({
            email: req.body.email,
        });
        const isMatch = await Security.Compare(req.body.password, user.password)
        // if (isMatch) {
        //     console.log('Password match')
        // }
        if (!user && !isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        const tokenGen = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                usertype: user.type
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d'
            }
        );
        if (user && isMatch) {
            res.status(200).json({
                success: true,
                message: 'Login successful',
                user: user,
                token: tokenGen
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

//POST Password comparision
router.post('/comparePassword', auth, async (req, res) => {

    try {

        const user = await User.findOne({
            email: req.body.email,
        });
        const isMatch = await Security.Compare(req.body.password, user.password)

        if (!isMatch) {
            return res.status(200).json({
                success: false,
                message: 'Password Mismatch',
                isMatched: isMatch
            });
        }
        if (isMatch) {
            res.status(200).json({
                success: true,
                message: 'Password Matched',
                isMatched: isMatch
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
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
        type: req.body.type,
        password: await Security.EncryptString(req.body.password),
        createdAt: Date.now(),
        isActive: true
    });

    try {
        console.log(newUser)
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put('/updatePassword', auth, async (req, res) => {
    // const data={
    //     email:req.body.email,
    //     password:req.body.password
    // }
    try {

        const user = await User.findOne({ email: req.body.email })
        if (!user) {

            return res.status(404).json({
                success: false,
                message: 'User not found'
            });

        }


        user.password = await Security.EncryptString(req.body.password)
            user.updatedAt = new Date();

        await user.save();
        return res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            isUpdated:true,
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// PUT: Update an existing user by ID
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after' }
        );
        res.status(200).json({
            success: true,
            message: 'Updated successful',
            user: updatedUser,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Remove an user by ID
router.delete('/:id', auth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

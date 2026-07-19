const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const Security = require('../securities/security');
const jwt = require('jsonwebtoken');
const auth = require('../securities/middleware/auth')
const upload = require('../securities/middleware/upload');
const path = require('path');
require('dotenv').config({
    path: './config/dev.env'
});
const mongoose = require('mongoose');
const {
    calculateGrowth,
    getWeekRange,
    getCount
} = require('../utils/dashboard-helper');



// GET: Fetch all Notes
router.get('/list', auth, async (req, res) => {
    try {
        // console.log('Note List Method')

        const Notelist = await Note.find();
        res.json(Notelist);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//GET:Note by  ID

router.get('/getByID/:id', auth, async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id });
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Get:NoteList by UserID with pagination
router.get('/getByUserID', auth, async (req, res) => {
    try {
        console.log(req.user)
        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;
        const stab = req.query.stab || 'All'
        const skip = (page - 1) * limit;

        const userid = req.user.userId;
        let notes = {};
        let total = 0;
        switch (stab) {
            case 'all':
                notes = await Note.find({
                    createdBy: userid,
                    isActive: true
                }).skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 });

                total = await Note.countDocuments({
                    createdBy: userid,
                    isActive: true
                });
                break;
            case 'favorite':
                notes = await Note.find({
                    createdBy: userid,
                    isActive: true,
                    isFavorite: true
                }).skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 });

                total = await Note.countDocuments({
                    createdBy: userid,
                    isActive: true,
                    isFavorite: true
                });

                break;
            case 'pinned':
                notes = await Note.find({
                    createdBy: userid,
                    isActive: true,
                    isPined: true
                }).skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 });

                total = await Note.countDocuments({
                    createdBy: userid,
                    isActive: true,
                    isPined: true
                });

                break;
            case 'reminded':
                notes = await Note.find({
                    createdBy: userid,
                    isActive: true,
                    isReminded: true
                }).skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 });

                total = await Note.countDocuments({
                    createdBy: userid,
                    isActive: true,
                    isReminded: true
                });

                break;
            default:
                break;
        }




        const totalPages = Math.ceil(total / limit);
        const updatedNotes = notes.map(note => {

            const obj = note.toObject();

            obj.attachmentUrl = obj.attachmentUrl.map(file => {
                return `${req.protocol}://${req.get('host')}/${file}`;
            });
            return obj;
        });

        res.json({
            status: "Success",
            message: "Note List by userid",
            notes: updatedNotes,
            total,
            page,
            totalPages
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
});

router.get('/getRecentNotes', auth, async (req, res) => {
    try {
        const userid = req.user.userId;
        const notes = await Note.find({
            createdBy: userid,
            isActive: true
        }).sort({ createdAt: -1 })
            .limit(6);;

        const recentNotes = notes.map(note => {

            const obj = note.toObject();

            obj.attachmentUrl = obj.attachmentUrl.map(file => {
                return `${req.protocol}://${req.get('host')}/${file}`;
            });
            return obj;
        });
        res.status(200).json({
            success: true,
            notes: recentNotes
        });


    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
});


router.get('/getListforStatsBoard', auth, async (req, res) => {

     try {

            const userId = req.user.userId;

            const {

                currentWeekStart,
                currentWeekEnd,
                previousWeekStart,
                previousWeekEnd

            } = getWeekRange();

            const currentStats = await Promise.all([

                getCount(
                    userId,
                    {},
                    currentWeekStart,
                    currentWeekEnd
                ),

                getCount(
                    userId,
                    { isFavorite: true },
                    currentWeekStart,
                    currentWeekEnd
                ),

                getCount(
                    userId,
                    { isPined: true },
                    currentWeekStart,
                    currentWeekEnd
                ),

                getCount(
                    userId,
                    { status: 'Archived' },
                    currentWeekStart,
                    currentWeekEnd
                )
            ]);

            const previousStats = await Promise.all([

                getCount(
                    userId,
                    {},
                    previousWeekStart,
                    previousWeekEnd
                ),

                getCount(
                    userId,
                    { isFavorite: true },
                    previousWeekStart,
                    previousWeekEnd
                ),

                getCount(
                    userId,
                    { isPined: true },
                    previousWeekStart,
                    previousWeekEnd
                ),

                getCount(
                    userId,
                    { status: 'Archived' },
                    previousWeekStart,
                    previousWeekEnd
                )
            ]);




            return res.status(200).json({

                status: 'Success',

                total: {
                    count: currentStats[0],
                    growth: calculateGrowth(
                        currentStats[0],
                        previousStats[0]
                    )
                },

                favorite: {
                    count: currentStats[1],
                    growth: calculateGrowth(
                        currentStats[1],
                        previousStats[1]
                    )
                },

                pinned: {
                    count: currentStats[2],
                    growth: calculateGrowth(
                        currentStats[2],
                        previousStats[2]
                    )
                },

                archived: {
                    count: currentStats[3],
                    growth: calculateGrowth(
                        currentStats[3],
                        previousStats[3]
                    )
                }
            });

        } catch (error) {

            return res.status(500).json({

                status: 'Failed',

                message: error.message
            });
        }
    }
);

// POST: Create a new Note
router.post(
    '/add', auth,
    upload.array('attachments', 10),
    async (req, res) => {

        try {
            const files = req.files
                ? req.files.map(file =>
                    file.path.replace(/\\/g, '/')
                )
                : [];

            const note = new Note({
                title: req.body.title,
                details: req.body.details,
                tag: req.body.tag,
                attachmentUrl: files,
                category: req.body.category,
                priority: req.body.priority,
                status: req.body.status,
                date: req.body.date,
                dueDate: req.body.dueDate,
                reminderDate: req.body.reminderDate,
                visibility: req.body.visibility,
                isFavorite: req.body.isFavorite,
                isPined: req.body.isPined,
                isReminded: req.body.isReminded,
                createdBy: req.user.userId,
                createdAt: new Date(),
                isActive: true
            });
            const savedNote = await note.save();

            res.status(201).json({
                status: 'Success',
                message: 'Note Added Success',
                // note: savedNote
            }

            );

        } catch (err) {
            res.status(500).json({
                message: err.message
            });
        }
    }
);
router.get('/test', (req, res) => {
    console.log('test working')
    res.send('Working');
});



// router.post('/add',auth,(req,res)=>{


// })

// router.post('/add', 
//    async (req, res) => {

//         console.log(req.body);
//         console.log(req.files);
//         console.log(req.user);
//         // try {

//         //     const files = req.files
//         //         ? req.files.map(file => file.path)
//         //         : [];

//         //     // const note = new Note({

//         //     //     title: req.body.title,
//         //     //     details: req.body.details,
//         //     //     tag: req.body.tag,
//         //     //     attachments: files,
//         //     //     category: req.body.category,
//         //     //     priority: req.body.priority,
//         //     //     status: req.body.status,
//         //     //     date: req.body.date,
//         //     //     dueDate: req.body.dueDate,
//         //     //     reminderDate: req.body.reminderDate,
//         //     //     visibility: req.body.visibility,
//         //     //     isFavorite: req.body.isFavorite,
//         //     //     isPined: req.body.isPined,
//         //     //     isReminded: req.body.isReminded,

//         //     //     createdBy: req.user._id,
//         //     //     createdAt: new Date(),
//         //     //     isActive: true
//         //     // });
//         //     console.log(req.body);
//         //     console.log(req.files);
//         //     console.log(req.user);
//         //     // console.log('Note : ', JSON.stringify(note))
//         //     // const savedNote = await note.save();

//         //     // res.status(201).json({
//         //     //     status: 'Success',
//         //     //     message: 'Note added successfully',
//         //     //     note: savedNote
//         //     // });

//         // } catch (err) {

//         //     res.status(500).json({
//         //         message: err.message
//         //     });
//         // }
//     }
// );


// router.post('/add', auth,async (req, res) => {
// console.log(req.body)
// console.log(req.file)
// console.log(req.user)
// });






module.exports = router;
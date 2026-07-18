const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const Security = require('../securities/security');
const jwt = require('jsonwebtoken');
const auth = require('../securities/middleware/auth')
const upload = require('../securities/middleware/upload');
const path = require('path');




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
// Get:NoteList by UserID
router.get('/getByUserID', auth, async (req, res) => {
    try {
        // console.log(req.user)
        const userid=req.user.userId;
        const notes = await Note.find({
            createdBy: userid
        });

        const updatedNotes = notes.map(note => {

            const obj = note.toObject();

            obj.attachmentUrl = obj.attachmentUrl.map(file => {
                return `${req.protocol}://${req.get('host')}/${file}`;
            });
            return obj;
        });

        res.json({
            status:"Success",
            message:"Note List by userid",
            notes:updatedNotes});

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
});


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
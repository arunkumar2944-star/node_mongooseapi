const mongoose = require('mongoose');
const { Priority, Status, Category } = require('./enum');

const NoteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    details: { type: String, required: true },
    tag: { type: String, required: true },
     attachmentUrl: {
        type: [String],
        default: []
    },
    priority: {
        type: String,
        enum: Object.values(Priority),
        default: Priority.MEDIUM
    },

    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.DRAFT
    },

    category: {
        type: String,
        enum: Object.values(Category),
        default: Category.PERSONAL
    },
     date: {
        type: Date,
        default: Date.now
    },
    dueDate: Date,
    reminderDate: Date,
      visibility: {
        type: String,
        required:true,
        default: 'Private'
    },
     isFavorite: {
        type: Boolean,
        default: false
    },

    isPined: {
        type: Boolean,
        default: false
    },

    isReminded: {
        type: Boolean,
        default: false
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    updatedAt: Date,

    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Note', NoteSchema);

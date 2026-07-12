const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    title: { type: String, required: true },
    route: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String, required: true },
    allowedUserType: { type: Number, required: true },
    createdBy: Number,
    createdAt: Date,
    updatedBy: Number,
    updatedAt: Date,
    isActive: Boolean

});

module.exports = mongoose.model('menuroutes', MenuSchema);
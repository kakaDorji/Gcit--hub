const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const fs = require('fs-extra')
const { Int32 } = require('mongodb')

const appSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Please tell us the app name"]
    },
    app_icon: {
        type: String,
        default: ''
    },
    app_path: {
        type: String,
        default: ''
    },
    app_size: {
        type: Number,
        default: 0
    },
    screenshots: {
        type: Array,
        default: []
    },
    owner_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: [true, "Need app owner"],
        ref: 'User' 
    },
    category: {
        type: String,
        required: [true, "Please specify the category"]
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500 // Maximum description length
    },
    releaseDate: {
        type: Date
    },
    lastUpdateDate: {
        type: Date
    },
    version: {
        type: String,
        required: [true, "Specify the app version"],
        trim: true,
        match: /^\d+\.\d+\.\d+$/ // Validate version as X.Y.Z (e.g., 1.2.3)
    }
})

appSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.releaseDate = currentDate
    this.lastUpdateDate = currentDate
    next()
});

appSchema.pre('findOneAndDelete', function(next) {
    // Perform file operations here (e.g., deleting associated files)
    fs.rmSync(`uploads/apps/${this.getQuery()._id}`, { recursive: true, force: true });
    next()
});

appSchema.pre('deleteMany', function(next) {
    // Perform file operations here (e.g., deleting associated files)
    fs.rmSync(`uploads/apps/${this.getQuery()._id}`, { recursive: true, force: true });
    next()
});

const App = mongoose.model('App', appSchema)
module.exports = App
// models/Comment.js
const mongoose = require('mongoose');
const { types } = require('util');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: { type: String, required: true },
    userName: { type: String, required: false }, // Reference to the User schema
    appId: { type: Schema.Types.ObjectId, ref: 'App', required: false},   // Reference to the App schema
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Comment', commentSchema);

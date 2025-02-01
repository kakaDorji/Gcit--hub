const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name"]
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: {
        type: String,
        default: 'default.jpg',
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords are not the same",
        }
    },
    type: {
        type: String,
        default: 'user'
    },
    resetToken: { // Add this field for the reset token
        type: String,
        select: false, // Do not return this field by default
    },
    resetTokenExpires: { // Add this field for token expiration
        type: Date,
    }
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined; // Remove passwordConfirm after hashing
    next();
});

// Hash the password before updating
userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update.password !== '' && 
        update.password !== undefined && 
        update.password === update.passwordConfirm) {

        this.getUpdate().password = await bcrypt.hash(update.password, 12);
        update.passwordConfirm = undefined; // Remove passwordConfirm after hashing
    }
    next();
});

// Method to check if password is correct
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword,
) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema);
module.exports = User;

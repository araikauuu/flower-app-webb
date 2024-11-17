// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: 'Username is required',
        unique: true,
        minlength: [3, 'Username must be at least 3 characters long.'],
        maxlength: [30, 'Username cannot exceed 30 characters.'],
        match: [/^[a-zA-Z]+$/, 'Username can only contain letters.']
    },
    password: {
        type: String,
        required: true,
        minlength: [4, 'Password must be at least 4 characters long.'],
        validate: {
            validator: function(v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(v);
            },
            message: props => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        }
    },
    firstName: {
        type: String,
        required: 'First name is required',
        match: [/^[a-zA-Z]+$/, 'First name can only contain letters.']
    },
    lastName: {
        type: String,
        required: 'Last name is required',
        match: [/^[a-zA-Z]+$/, 'Last name can only contain letters.']
    },
    age: {
        type: Number,
        required: true,
        min: [18, 'Age must be at least 18'],
        max: [120, 'Age must be realistic']
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female']
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'editor'], // Only 'admin' or 'editor' are allowed
        default: 'editor'
    },
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);

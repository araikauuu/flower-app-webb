//models/Flower.js
const mongoose = require('mongoose');

const FlowerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Flower name is required'],
        minlength: [3, 'Name must be at least 3 characters long']
    },
    description: {
        type: String,
        required: [true, 'Flower description is required'],
        minlength: [5, 'Description must be at least 5 characters long']
    },
    images: {
        type: [String], // Array of image URLs
        validate: {
            validator: function (v) {
                return v.length === 3; // Ensure exactly 3 images are provided
            },
            message: 'You must provide exactly 3 image URLs.'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'bloomed'],
        default: 'pending',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Flower', FlowerSchema);

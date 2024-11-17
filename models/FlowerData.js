//models/FlowerData.js
const mongoose = require('mongoose');

const flowerSchema = new mongoose.Schema({
    species: { type: String, required: true },
    size: { type: String, required: true },
    fragrance: { type: String, required: true },
    height_cm: { type: Number, required: true },
});


const FlowerData = mongoose.model('FlowerData', flowerSchema);

module.exports = FlowerData;

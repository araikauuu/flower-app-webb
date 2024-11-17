//importCsv.js
const fs = require('fs');
const csvParser = require('csv-parser');
const FlowerData = require('./models/FlowerData');
const mongoose = require('mongoose');


const mongoURI = 'mongodb+srv://1234:1234@blogdb.udoa3.mongodb.net/todoDB?retryWrites=true&w=majority&appName=blogDB';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Function to import the CSV data into the MongoDB database
function importCsv() {
    const flowers = [];
    fs.createReadStream('flower_dataset.csv')
        .pipe(csvParser())
        .on('data', (row) => {
            flowers.push(row);
        })
        .on('end', async () => {
            try {
                await FlowerData.insertMany(flowers);
                console.log('CSV data imported successfully');
            } catch (err) {
                console.error('Error importing CSV data:', err);
            }
        });
}

importCsv();

//index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Flower = require('./models/Flower');
const User = require('./models/User');
const checkRole = require('./checkRole');
const fs = require('fs');
const csvParser = require('csv-parser');
const FlowerData = require('./models/FlowerData');
const axios = require('axios');
const cors = require('cors');


const mongoURI = "mongodb+srv://1234:1234@blogdb.udoa3.mongodb.net/todoDB?retryWrites=true&w=majority&appName=blogDB";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/bloomingTimes.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'bloomingTimes.html'));
});
app.use(cors()); // This allows cross-origin requests
const jwtSecret = '46b429049ab54fc05630f98b1284b8428aba49929e6d689c31592d46aa28675';

const verifyToken = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, jwtSecret);
        const user = await User.findById(verified.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        req.user = user;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

app.post('/flowers', verifyToken, async (req, res) => {
    try {
        const { name, description, images } = req.body;
        const newFlower = new Flower({
            name,
            description,
            images,
            user: req.user._id
        });
        const flower = await newFlower.save();
        res.status(201).json(flower);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/flowers', verifyToken, async (req, res) => {
    try {
        const flowers = await Flower.find();
        res.json(flowers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/flowers/:id', verifyToken, checkRole('admin'), async (req, res) => {
    try {
        const flower = await Flower.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updated_at: Date.now() },
            { new: true }
        );
        if (!flower) return res.status(404).json({ error: 'Flower not found' });
        res.json(flower);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/flowers/:id', verifyToken, checkRole('admin'), async (req, res) => {
    try {
        const flower = await Flower.findByIdAndDelete(req.params.id);
        if (!flower) return res.status(404).json({ error: 'Flower not found' });
        res.json({ message: 'Flower deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Register user with new fields
app.post('/register', async (req, res) => {
    const { username, password, firstName, lastName, age, gender, role } = req.body;

    // Validate the role
    if (!['admin', 'editor'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
    }

    // Ensure age is valid
    if (age < 18 || age > 120) {
        return res.status(400).json({ error: 'Age must be between 18 and 120' });
    }

    try {
        const user = new User({ username, password, firstName, lastName, age, gender, role });
        await user.save();
        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'Invalid username or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid username or password' });

        const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to get statistics
// Route to get statistics
app.get('/api/stats', async (req, res) => {
    try {
        const flowers = await FlowerData.find();

        console.log('Fetched flowers:', flowers); // Debugging line

        if (flowers.length === 0) {
            return res.status(404).json({ error: 'No data found' });
        }

        const heights = flowers.map(flower => flower.height_cm);
        const averageHeight = heights.reduce((a, b) => a + b, 0) / heights.length;

        const species = getMode(flowers.map(flower => flower.species));
        const size = getMode(flowers.map(flower => flower.size));
        const fragrance = getMode(flowers.map(flower => flower.fragrance));

        const minHeight = Math.min(...heights);
        const maxHeight = Math.max(...heights);

        const speciesCount = countOccurrences(flowers.map(flower => flower.species));
        const sizeCount = countOccurrences(flowers.map(flower => flower.size));
        const fragranceCount = countOccurrences(flowers.map(flower => flower.fragrance));

        console.log('Statistics:', {
            averageHeight,
            species,
            size,
            fragrance,
            minHeight,
            maxHeight,
            speciesCount,
            sizeCount,
            fragranceCount
        }); // Debugging line

        res.json({
            average: averageHeight,
            speciesMode: species,
            sizeMode: size,
            fragranceMode: fragrance,
            min: minHeight,
            max: maxHeight,
            speciesCount: speciesCount,
            sizeCount: sizeCount,
            fragranceCount: fragranceCount
        });
    } catch (err) {
        console.error('Error fetching data:', err); // Added error logging
        res.status(500).json({ error: 'Error fetching data' });
    }
});

// Function to count occurrences of items in an array
function countOccurrences(arr) {
    const count = {};
    arr.forEach(item => {
        count[item] = (count[item] || 0) + 1;
    });
    return count;
}

// Function to get the most frequent item (mode)
function getMode(arr) {
    const frequency = countOccurrences(arr);
    let maxCount = 0;
    let mode = [];

    for (const key in frequency) {
        if (frequency[key] > maxCount) {
            mode = [key];
            maxCount = frequency[key];
        } else if (frequency[key] === maxCount) {
            mode.push(key);
        }
    }

    return mode;
}

// Route to import CSV
app.post('/api/import-csv', (req, res) => {
    const flowers = [];
    fs.createReadStream('flower_dataset.csv')
        .pipe(csvParser())
        .on('data', (row) => {
            flowers.push(row);
        })
        .on('end', async () => {
            try {
                await FlowerData.insertMany(flowers);
                res.json({ message: 'CSV data imported successfully' });
            } catch (err) {
                res.status(500).json({ error: 'Error importing CSV' });
            }
        });
});

const climateChangeNews = async (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://climate-change-news142.p.rapidapi.com/news/bbc',
        headers: {
            'x-rapidapi-key': '25df3e4e35mshc964e3b2fb97436p1669ffjsnb47a53aa14d9',
            'x-rapidapi-host': 'climate-change-news142.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);  // Send the fetched data as response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch climate change news' });
    }
};

app.get('/climate-change-news', climateChangeNews);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

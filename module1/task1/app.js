const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Підключення до бази даних MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/task1', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// Схема та модель для збереження запитів
const requestSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    a: Number,
    b: Number,
    c: Number,
    result: Boolean
});
const Request = mongoose.model('Request', requestSchema);

app.use(bodyParser.json());

// Middleware для перевірки валідності даних
function validateInput(req, res, next) {
    const { a, b, c } = req.body;
    if (typeof a !== 'number' || typeof b !== 'number' || typeof c !== 'number') {
        return res.status(400).json({ error: 'Invalid parameters' });
    }
    next();
}

app.get('/', async (req, res) => {
    try {
        const allRequests = await Request.find();
        res.json(allRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

// Endpoint для отримання результату через POST-запит
app.post('/check-triangle', validateInput, async (req, res) => {
    const { a, b, c } = req.body;
    const isValid = checkTriangle(parseInt(a), parseInt(b), parseInt(c));

    // Збереження інформації у базі даних MongoDB
    const request = new Request({ a, b, c, result: isValid });
    try {
        const savedRequest = await request.save();
        console.log('Request saved to MongoDB');
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save request' });
    }

    res.json({ result: isValid });
});


// Функція для перевірки чи можуть числа бути сторонами рівнобедреного гострокутного трикутника
function checkTriangle(a, b, c) {
    if (a === b || b === c || a === c) {
        const sum = Math.pow(a, 2) + Math.pow(b, 2);
        return sum === Math.pow(c, 2);
    }
    return false;
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

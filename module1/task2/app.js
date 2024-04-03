const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/task2', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

const requestSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    input: Number,
    result: Number
});

const Request = mongoose.model('Request', requestSchema);

function calculateSequence(n) {
    if (n === 0 || n === 1) {
        return 1;
    }
    let x0 = 1;
    let x1 = 1;
    let xi;
    for (let i = 2; i <= n; i++) {
        xi = x1 + 2 * x0;
        x0 = x1;
        x1 = xi;
    }
    return xi;
}

app.use(bodyParser.json());

app.get('/', async (req, res) => {
    try {
        const allRequests = await Request.find();
        res.json(allRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});


app.post('/calculate-sequence', async (req, res) => {
    const { n } = req.body;
    if (typeof n !== 'number') {
        return res.status(400).json({ error: 'Invalid input' });
    }

    const result = calculateSequence(n);

    const request = new Request({ input: n, result });
    try {
        const savedRequest = await request.save();
        console.log('Request saved to MongoDB');
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save request' });
    }

    res.json({ result });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


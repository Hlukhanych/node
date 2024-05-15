const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/studentDB', { useNewUrlParser: true, useUnifiedTopology: true });

const studentSchema = new mongoose.Schema({
    surname: String,
    faculty: String,
    course: Number,
    gender: String,
    scholarship: Number,
    grade1: Number,
    grade2: Number,
    grade3: Number
});

const Student = mongoose.model('Student', studentSchema);

app.use(express.json());

// Upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    data.forEach(studentData => {
        const student = new Student({
            surname: studentData.surname,
            faculty: studentData.faculty,
            course: studentData.course,
            gender: studentData.gender,
            scholarship: studentData.scholarship,
            grade1: studentData.grade1,
            grade2: studentData.grade2,
            grade3: studentData.grade3
        });
        student.save();
    });

    res.send('Data imported successfully');
});


// Background task
app.get('/excellent', async (req, res) => {
    const excellentCount = await Student.countDocuments({
        grade1: { $gte: 90 },
        grade2: { $gte: 90 },
        grade3: { $gte: 90 }
    });
    res.send(`Number of students with excellent grades: ${excellentCount}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const [apps] = await db.query('SELECT * FROM applications ORDER BY created_at DESC');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const {
    userId, studentName, email, phone, age, gender, desiredCourse,
    address, previousSchool, previousSchoolYear, guardianName, guardianPhone
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO applications 
      (user_id, student_name, email, phone, age, gender, desired_course, address, previous_school, previous_school_year, guardian_name, guardian_phone) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, studentName, email, phone, age, gender, desiredCourse, address, previousSchool, previousSchoolYear, guardianName, guardianPhone]
    );

    res.status(201).json({ id: result.insertId, message: 'Application created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/status', async (req, res) => {
  const { status, studentIdNumber } = req.body;
  try {
    await db.query(
      'UPDATE applications SET status = ?, student_id_number = ? WHERE id = ?',
      [status, studentIdNumber || null, req.params.id]
    );
    res.json({ message: 'Application status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
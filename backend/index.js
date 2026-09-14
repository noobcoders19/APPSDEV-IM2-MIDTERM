require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3307),
  user: process.env.DB_USER || 'cpc',
  password: process.env.DB_PASS || 'cpc_password',
  database: process.env.DB_NAME || 'cpc_admissions'
});

app.get('/api/student/data/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [profiles] = await db.query('SELECT * FROM student_profiles WHERE user_id = ?', [userId]);
    const [apps] = await db.query('SELECT * FROM student_applications WHERE user_id = ?', [userId]);
    const [schedules] = await db.query('SELECT * FROM student_schedules WHERE user_id = ?', [userId]);

    res.json({
      profile: profiles[0] || null,
      application: apps[0] || null,
      schedules: schedules || []
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/student/profile', upload.single('profile_picture'), async (req, res) => {
  try {
    const { user_id, full_name, phone, age, course_input, address, previous_school, guardian_name } = req.body;
    const profile_picture = req.file ? req.file.filename : null;

    const [existing] = await db.query('SELECT * FROM student_profiles WHERE user_id = ?', [user_id]);

    if (existing.length > 0) {
      await db.query(
        `UPDATE student_profiles SET full_name=?, phone=?, age=?, course_input=?, address=?, previous_school=?, guardian_name=? ${profile_picture ? ', profile_picture=?' : ''} WHERE user_id=?`,
        profile_picture 
          ? [full_name, phone, age, course_input, address, previous_school, guardian_name, profile_picture, user_id]
          : [full_name, phone, age, course_input, address, previous_school, guardian_name, user_id]
      );
    } else {
      await db.query(
        `INSERT INTO student_profiles (user_id, full_name, phone, age, course_input, address, previous_school, guardian_name, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, full_name, phone, age, course_input, address, previous_school, guardian_name, profile_picture]
      );
    }

    res.json({ message: 'Profile saved successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/student/apply', upload.fields([
  { name: 'report_card', maxCount: 1 },
  { name: 'birth_certificate', maxCount: 1 },
  { name: 'id_picture', maxCount: 1 },
  { name: 'good_moral', maxCount: 1 }
]), async (req, res) => {
  try {
    const { user_id } = req.body;
    const files = req.files;

    const report_card = files['report_card'] ? files['report_card'][0].filename : null;
    const birth_certificate = files['birth_certificate'] ? files['birth_certificate'][0].filename : null;
    const id_picture = files['id_picture'] ? files['id_picture'][0].filename : null;
    const good_moral = files['good_moral'] ? files['good_moral'][0].filename : null;

    await db.query(
      `INSERT INTO student_applications (user_id, report_card, birth_certificate, id_picture, good_moral, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')
       ON DUPLICATE KEY UPDATE report_card=?, birth_certificate=?, id_picture=?, good_moral=?, status='pending'`,
      [user_id, report_card, birth_certificate, id_picture, good_moral, report_card, birth_certificate, id_picture, good_moral]
    );

    res.json({ message: 'Application and files submitted successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/admin/students', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.id AS user_id,
        p.full_name, p.phone, p.age, p.course_input, p.address, p.previous_school, p.guardian_name, p.profile_picture,
        a.report_card, a.birth_certificate, a.id_picture, a.good_moral, 
        COALESCE(a.status, 'no_application') AS status,
        a.student_id_number
      FROM users u
      LEFT JOIN student_profiles p ON u.id = p.user_id
      LEFT JOIN student_applications a ON u.id = a.user_id
      WHERE u.role = 'student'
      ORDER BY u.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/admin/review', async (req, res) => {
  try {
    const { user_id, status } = req.body;

    if (status === 'approved') {
      const generatedId = 'CPC-2026-' + Math.floor(1000 + Math.random() * 9000);
      await db.query('UPDATE student_applications SET status = ?, student_id_number = ? WHERE user_id = ?', [status, generatedId, user_id]);

      await db.query('DELETE FROM student_schedules WHERE user_id = ?', [user_id]);
      await db.query(`
        INSERT INTO student_schedules (user_id, subject_code, subject_description, schedule_time, room) VALUES
        (?, 'IT 101', 'Introduction to Computing', 'MWF 08:00 AM - 09:30 AM', 'Lab 1'),
        (?, 'IT 102', 'Computer Programming 1', 'MWF 10:00 AM - 11:30 AM', 'Lab 2'),
        (?, 'GEN 001', 'Understanding the Self', 'TTH 01:00 PM - 02:30 PM', 'Room 204')
      `, [user_id, user_id, user_id]);
    } else {
      await db.query('UPDATE student_applications SET status = ? WHERE user_id = ?', [status, user_id]);
    }

    res.json({ message: `Application ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
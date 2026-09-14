require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3307),
  user: process.env.DB_USER || 'cpc',
  password: process.env.DB_PASS || 'cpc_password',
  database: process.env.DB_NAME || 'cpc_admissions',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to cpc_admissions MySQL database!');
    connection.release();
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
const uploadFields = upload.any();


app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const checkUserSql = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserSql, [email.trim().toLowerCase()], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Email is already registered.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertSql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
      
      db.query(insertSql, [name.trim(), email.trim().toLowerCase(), hashedPassword, role || 'student'], (insertErr) => {
        if (insertErr) {
          return res.status(500).json({ message: `Database error: ${insertErr.sqlMessage || insertErr.message}` });
        }
        return res.status(201).json({ message: 'User registered successfully!' });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email.trim().toLowerCase()], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = results[0];
    
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (e) {
      isMatch = false;
    }

    if (!isMatch && password === user.password) {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user.id,
        name: user.name || user.full_name,
        email: user.email,
        role: user.role ? user.role.toLowerCase().trim() : 'student'
      }
    });
  });
});

app.post('/api/forgot-password', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const currentPassword = String(req.body.currentPassword || '');
  const password = String(req.body.password || '');

  if (!email || !currentPassword || password.length < 6) {
    return res.status(400).json({ message: 'Enter your email, current password, and a new password with at least 6 characters.' });
  }

  try {
    const [users] = await db.promise().query('SELECT id, password FROM users WHERE email = ? LIMIT 1', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'No account was found with that email.' });
    }

    let currentPasswordMatches = false;
    try {
      currentPasswordMatches = await bcrypt.compare(currentPassword, users[0].password);
    } catch {
      currentPasswordMatches = currentPassword === users[0].password;
    }
    if (!currentPasswordMatches && currentPassword !== users[0].password) {
      return res.status(401).json({ message: 'The current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.promise().query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, users[0].id]);
    return res.json({ message: 'Password updated successfully. You can now sign in.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


app.post('/api/student/application', uploadFields, (req, res) => {
  try {
    const user_id = req.body.user_id || null;
    const full_name = req.body.full_name || null;
    const phone = req.body.phone || null;
    const age = req.body.age || null;
    const gender = req.body.gender || null;
    const course_input = req.body.course_input || null;
    const address = req.body.address || null;
    const previous_school = req.body.previous_school || null;

    const filesArray = req.files || [];
    const files = {};
    filesArray.forEach(file => {
      files[file.fieldname] = file.filename;
    });

    const profile_picture = files.profile_picture || null;
    const photo_2x2 = files.photo_2x2 || files.photo || null;
    const valid_id = files.valid_id || null;
    const report_card = files.report_card || null;
    const birth_certificate = files.birth_certificate || null;

    if (!user_id) {
      return res.status(400).json({ message: 'User account is required. Please log in again.' });
    }

    const sql = `
      INSERT INTO applications 
      (user_id, full_name, phone, age, gender, course_input, address, previous_school, profile_picture, photo_2x2, valid_id, report_card, birth_certificate, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      full_name = COALESCE(VALUES(full_name), full_name),
      phone = COALESCE(VALUES(phone), phone),
      age = COALESCE(VALUES(age), age),
      gender = COALESCE(VALUES(gender), gender),
      course_input = COALESCE(VALUES(course_input), course_input),
      address = COALESCE(VALUES(address), address),
      previous_school = COALESCE(VALUES(previous_school), previous_school),
      profile_picture = COALESCE(VALUES(profile_picture), profile_picture),
      photo_2x2 = COALESCE(VALUES(photo_2x2), photo_2x2),
      valid_id = COALESCE(VALUES(valid_id), valid_id),
      report_card = COALESCE(VALUES(report_card), report_card),
      birth_certificate = COALESCE(VALUES(birth_certificate), birth_certificate),
      status = 'pending'
    `;

    db.query(
      sql,
      [user_id, full_name, phone, age, gender, course_input, address, previous_school, profile_picture, photo_2x2, valid_id, report_card, birth_certificate, 'pending'],
      (err) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        return res.status(200).json({ message: 'Application submitted successfully!' });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post('/api/student/application/requirements', uploadFields, (req, res) => {
  const userId = req.body.user_id;
  const courseInput = req.body.course_input || null;
  const uploadedFiles = {};

  (req.files || []).forEach((file) => {
    uploadedFiles[file.fieldname] = file.filename;
  });

  if (!userId) {
    return res.status(400).json({ message: 'User account is required.' });
  }

  const sql = `
    UPDATE applications
    SET course_input = COALESCE(?, course_input),
        photo_2x2 = COALESCE(?, photo_2x2),
        valid_id = COALESCE(?, valid_id),
        report_card = COALESCE(?, report_card),
        birth_certificate = COALESCE(?, birth_certificate),
        status = 'pending'
    WHERE user_id = ?
    ORDER BY id DESC
    LIMIT 1
  `;

  db.query(sql, [
    courseInput,
    uploadedFiles.photo_2x2 || null,
    uploadedFiles.valid_id || null,
    uploadedFiles.report_card || null,
    uploadedFiles.birth_certificate || null,
    userId,
  ], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Please save your personal profile first.' });
    }

    return res.json({ message: 'Requirements submitted successfully.' });
  });
});

app.get('/api/student/application/:user_id', (req, res) => {
  let { user_id } = req.params;
  
  if (user_id && user_id.includes(':')) {
    user_id = user_id.split(':')[0];
  }

  const sql = 'SELECT * FROM applications WHERE user_id = ? ORDER BY id DESC LIMIT 1';
  
  db.query(sql, [user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (results.length === 0) {
      return res.json({});
    }
    res.json(results[0]);
  });
});

app.delete('/api/student/application/:user_id', (req, res) => {
  const { user_id } = req.params;

  db.query('DELETE FROM applications WHERE user_id = ?', [user_id], (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: 'Application deleted successfully!' });
  });
});


app.get('/api/admin/applications', (req, res) => {
  const sql = 'SELECT * FROM applications ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(results);
  });
});

app.put('/api/admin/applications/:id/status', (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const sql = 'UPDATE applications SET status = ? WHERE id = ?';
  db.query(sql, [status, id], (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: `Application status updated to ${status}` });
  });
});

app.put('/api/admin/applications/:id/schedule', (req, res) => {
  const { title, appointment_date, venue } = req.body;
  const { id } = req.params;

  const sql = `
    UPDATE applications 
    SET status = 'Approved', appointment_title = ?, appointment_date = ?, appointment_venue = ? 
    WHERE id = ?
  `;
  
  db.query(sql, [title || 'On-Site Requirement Verification', appointment_date, venue, id], (err) => {
    if (err) {
      return res.status(500).json({ message: err.number || err.message });
    }
    res.json({ message: 'Student successfully notified with schedule!' });
  });
});

app.listen(5000, () => {
  console.log('Server executing on http://localhost:5000');
});

app.put('/api/admin/applications/:id/message', (req, res) => {
  const { message } = req.body;
  const { id } = req.params;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  db.query('UPDATE applications SET admin_message = ? WHERE id = ?', [message.trim(), id], (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: 'Message sent to student.' });
  });
});
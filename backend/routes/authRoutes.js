const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

module.exports = (db) => {
  router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
      const checkSql = 'SELECT * FROM users WHERE email = ?';
      db.query(checkSql, [email.trim().toLowerCase()], async (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        if (results.length > 0) return res.status(400).json({ message: 'Email is already registered.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertSql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';

        db.query(insertSql, [name.trim(), email.trim().toLowerCase(), hashedPassword, role || 'student'], (insertErr) => {
          if (insertErr) return res.status(500).json({ message: insertErr.message });
          return res.status(201).json({ message: 'User registered successfully!' });
        });
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });

  router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email.trim().toLowerCase()], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error.' });
      if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password.' });

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

  return router;
};
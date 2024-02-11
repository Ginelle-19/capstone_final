const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise'); // Use promise-based MySQL client

// Create a MySQL connection pool (replace with your database connection details)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'user',
  password: '',
  database: 'inventorydb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check username and password against your user database
    const query = 'SELECT * FROM tblAccount WHERE username = ? AND password = ?';
    const [rows, fields] = await pool.execute(query, [username, password]);

    if (rows.length === 1) {
      const user = rows[0];

      // Generate a token
      const token = jwt.sign({ sub: user.id, username: user.username }, 'your_secret_key', { expiresIn: '1h' });

      // Return a response with the token and user information
      res.json({ token, username: user.username });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

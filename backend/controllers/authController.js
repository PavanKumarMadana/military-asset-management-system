const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const register = async (req, res) => {
  const { username, password, role, base } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.run(`INSERT INTO users (username, password, role, base) VALUES (?, ?, ?, ?)`, [username, hashedPassword, role, base], function(err) {
    if (err) return res.status(400).json({ message: 'User already exists' });
    logger(`User registered: ${username}`);
    res.status(201).json({ message: 'User registered' });
  });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err || !user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role, base: user.base }, process.env.JWT_SECRET);
    logger(`User logged in: ${username}`);
    res.json({ token });
  });
};

module.exports = { register, login };
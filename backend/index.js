const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const logger = require('./utils/logger'); // Import the logger
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create tables and seed default admin if needed
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT,
    base TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    base TEXT,
    quantity INTEGER,
    openingBalance INTEGER DEFAULT 0,
    closingBalance INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_id INTEGER,
    quantity INTEGER,
    base TEXT,
    date TEXT,
    user_id INTEGER,
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS transfers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_id INTEGER,
    quantity INTEGER,
    fromBase TEXT,
    toBase TEXT,
    date TEXT,
    user_id INTEGER,
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_id INTEGER,
    personnel TEXT,
    quantity INTEGER,
    base TEXT,
    date TEXT,
    type TEXT,
    user_id INTEGER,
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  const bcrypt = require('bcryptjs');
  const defaultPassword = 'admin123';
  bcrypt.hash(defaultPassword, 10, (err, hashed) => {
    if (err) return console.error('Admin seed error', err);
    db.get('SELECT COUNT(*) AS count FROM users', (err, row) => {
      if (!err && row.count === 0) {
        db.run('INSERT OR IGNORE INTO users (username, password, role, base) VALUES (?, ?, ?, ?)', ['admin', hashed, 'Admin', 'HQ'], (insertErr) => {
          if (insertErr) console.error('Admin seed insert error', insertErr);
          else console.log('Default admin user created: admin / admin123');
        });
      }
    });

    // Add sample assets and purchases
    db.get('SELECT COUNT(*) AS count FROM assets', (err, row) => {
      if (!err && row.count === 0) {
        db.run(`INSERT INTO assets (name, type, base, quantity, openingBalance, closingBalance) VALUES (?, ?, ?, ?, ?, ?)`, 
          ['M4 Carbine', 'weapon', 'Base A', 100, 100, 100]);
        db.run(`INSERT INTO assets (name, type, base, quantity, openingBalance, closingBalance) VALUES (?, ?, ?, ?, ?, ?)`, 
          ['Humvee', 'vehicle', 'Base A', 50, 50, 50]);
        db.run(`INSERT INTO assets (name, type, base, quantity, openingBalance, closingBalance) VALUES (?, ?, ?, ?, ?, ?)`, 
          ['5.56mm Ammunition', 'ammunition', 'Base A', 10000, 10000, 10000]);
        db.run(`INSERT INTO assets (name, type, base, quantity, openingBalance, closingBalance) VALUES (?, ?, ?, ?, ?, ?)`, 
          ['M4 Carbine', 'weapon', 'Base B', 75, 75, 75]);
        console.log('Sample assets created');
      }
    });
  });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const transferRoutes = require('./routes/transferRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const assetRoutes = require('./routes/assetRoutes');
const seedRoutes = require('./routes/seedRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/seed', seedRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger(`Server is running on port ${PORT}`);
});
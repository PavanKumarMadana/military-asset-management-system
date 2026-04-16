const express = require('express');
const db = require('../config/db');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/seed', (req, res) => {
  db.serialize(() => {
    // Insert sample assets
    db.run(`INSERT OR IGNORE INTO assets (name, type, base, quantity, openingBalance, closingBalance) 
            VALUES (?, ?, ?, ?, ?, ?)`, 
    ['M4 Carbine', 'weapon', 'Base A', 100, 100, 100], (err) => {
      if (err) console.error(err);
    });

    db.run(`INSERT OR IGNORE INTO assets (name, type, base, quantity, openingBalance, closingBalance) 
            VALUES (?, ?, ?, ?, ?, ?)`, 
    ['Humvee', 'vehicle', 'Base A', 50, 50, 50], (err) => {
      if (err) console.error(err);
    });

    db.run(`INSERT OR IGNORE INTO assets (name, type, base, quantity, openingBalance, closingBalance) 
            VALUES (?, ?, ?, ?, ?, ?)`, 
    ['5.56mm Ammunition', 'ammunition', 'Base A', 10000, 10000, 10000], (err) => {
      if (err) console.error(err);
    });

    db.run(`INSERT OR IGNORE INTO assets (name, type, base, quantity, openingBalance, closingBalance) 
            VALUES (?, ?, ?, ?, ?, ?)`, 
    ['M4 Carbine', 'weapon', 'Base B', 75, 75, 75], (err) => {
      if (err) console.error(err);
    });

    // Insert sample purchase
    db.get('SELECT id FROM users WHERE username = ?', ['admin'], (err, user) => {
      if (!err && user) {
        db.run(`INSERT OR IGNORE INTO purchases (asset_id, quantity, base, date, user_id) 
                VALUES (?, ?, ?, ?, ?)`, 
        [1, 25, 'Base A', new Date().toISOString(), user.id], (err) => {
          if (err) console.error(err);
        });
      }
    });
  });

  logger('Sample data seeded');
  res.json({ message: 'Sample data seeded successfully' });
});

module.exports = router;

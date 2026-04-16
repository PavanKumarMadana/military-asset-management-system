const db = require('../config/db');
const logger = require('../utils/logger');

const createAssignment = async (req, res) => {
  const { assetId, personnel, quantity, base, type } = req.body;
  db.run(`INSERT INTO assignments (asset_id, personnel, quantity, base, date, type, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`, [assetId, personnel, quantity, base, new Date().toISOString(), type, req.user.id], function(err) {
    if (err) return res.status(400).json({ message: 'Error creating assignment' });
    if (type === 'expended') {
      db.run(`UPDATE assets SET quantity = quantity - ? WHERE id = ?`, [quantity, assetId]);
    }
    logger(`Assignment created: ${type} ${quantity} of asset ${assetId} to ${personnel}`);
    res.status(201).json({ id: this.lastID });
  });
};

const getAssignments = async (req, res) => {
  db.all(`SELECT a.*, asst.name as assetName FROM assignments a JOIN assets asst ON a.asset_id = asst.id`, [], (err, rows) => {
    if (err) return res.status(400).json({ message: 'Error' });
    res.json(rows);
  });
};

module.exports = { createAssignment, getAssignments };
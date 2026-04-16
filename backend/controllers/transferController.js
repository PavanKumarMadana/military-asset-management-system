const db = require('../config/db');
const logger = require('../utils/logger');

const createTransfer = async (req, res) => {
  const { assetId, quantity, fromBase, toBase } = req.body;
  db.run(`INSERT INTO transfers (asset_id, quantity, fromBase, toBase, date, user_id) VALUES (?, ?, ?, ?, ?, ?)`, [assetId, quantity, fromBase, toBase, new Date().toISOString(), req.user.id], function(err) {
    if (err) return res.status(400).json({ message: 'Error creating transfer' });
    // Update quantities - assuming asset is per base, but for simplicity, just log
    logger(`Transfer created: ${quantity} of asset ${assetId} from ${fromBase} to ${toBase}`);
    res.status(201).json({ id: this.lastID });
  });
};

const getTransfers = async (req, res) => {
  db.all(`SELECT t.*, a.name as assetName FROM transfers t JOIN assets a ON t.asset_id = a.id`, [], (err, rows) => {
    if (err) return res.status(400).json({ message: 'Error' });
    res.json(rows);
  });
};

module.exports = { createTransfer, getTransfers };
const db = require('../config/db');
const logger = require('../utils/logger');

const createPurchase = async (req, res) => {
  const { assetId, quantity, base } = req.body;
  // RBAC: Check if the user has permission to create a purchase for this base
  // Admin can create for any base. Base Commander/Logistics Officer can only create for their assigned base.
  if (req.user.role !== 'Admin' && req.user.base !== base) {
    logger(`Access denied: User ${req.user.id} (${req.user.role}) attempted to create purchase for base ${base} but is assigned to ${req.user.base}`, 'warn');
    return res.status(403).json({ message: 'Access denied to create purchase for this base' });
  }

  db.run(`INSERT INTO purchases (asset_id, quantity, base, date, user_id) VALUES (?, ?, ?, ?, ?)`, [assetId, quantity, base, new Date().toISOString(), req.user.id], function(err) {
    if (err) {
      logger(`Error creating purchase: ${err.message}`, 'error');
      return res.status(400).json({ message: 'Error creating purchase' });
    }
    db.run(`UPDATE assets SET quantity = quantity + ? WHERE id = ?`, [quantity, assetId], (updateErr) => {
      if (updateErr) {
        logger(`Error updating asset quantity after purchase: ${updateErr.message}`, 'error');
        // Even if asset update fails, the purchase was recorded. Decide if you want to roll back or just log.
      }
      logger(`Purchase created: ${quantity} of asset ${assetId} for base ${base}`);
      res.status(201).json({ id: this.lastID });
    });
  });
};

const getPurchases = async (req, res) => {
  const { base, date, equipmentType } = req.query; // equipmentType is used for filtering
  let query = `SELECT p.*, a.name as assetName, a.type as asset_type FROM purchases p JOIN assets a ON p.asset_id = a.id WHERE 1=1`;
  let params = [];

  // RBAC: If user is not Admin, automatically filter by their base
  if (req.user.role !== 'Admin') {
    query += ` AND p.base = ?`;
    params.push(req.user.base);
  }
  if (base) {
    query += ` AND p.base = ?`;
    params.push(base);
  }
  if (date) {
    query += ` AND p.date >= ?`;
    params.push(date);
  }
  if (equipmentType) {
    query += ` AND a.type = ?`;
    params.push(equipmentType);
  }
  db.all(query, params, (err, rows) => {
    if (err) {
      logger(`Error fetching purchases: ${err.message}`, 'error');
      return res.status(400).json({ message: 'Error fetching purchases' });
    }
    res.json(rows);
  });
};

module.exports = { createPurchase, getPurchases };
const db = require('../config/db');
const logger = require('../utils/logger');

const getAssets = async (req, res) => {
  let query = `SELECT id, name, type, base, quantity, openingBalance, closingBalance FROM assets WHERE 1=1`;
  const params = [];

  // RBAC: If not Admin, filter assets by user's base
  if (req.user.role !== 'Admin') {
    query += ` AND base = ?`;
    params.push(req.user.base);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      logger(`Error fetching assets: ${err.message}`, 'error');
      return res.status(500).json({ message: 'Error fetching assets' });
    }
    res.json(rows);
  });
};

module.exports = { getAssets };
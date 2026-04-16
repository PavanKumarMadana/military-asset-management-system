const db = require('../config/db');

const getDashboardData = async (req, res) => {
  const { base, date, equipmentType } = req.query;
  let assetQuery = `SELECT * FROM assets WHERE 1=1`;
  let params = [];
  if (base) {
    assetQuery += ` AND base = ?`;
    params.push(base);
  }
  if (equipmentType) {
    assetQuery += ` AND type = ?`;
    params.push(equipmentType);
  }
  db.all(assetQuery, params, (err, assets) => {
    if (err) return res.status(400).json({ message: 'Error' });
    let purchaseQuery = `SELECT SUM(quantity) as total FROM purchases WHERE 1=1`;
    let pParams = [];
    if (base) {
      purchaseQuery += ` AND base = ?`;
      pParams.push(base);
    }
    if (date) {
      purchaseQuery += ` AND date >= ?`;
      pParams.push(date);
    }
    db.get(purchaseQuery, pParams, (err, purchaseRow) => {
      let transferInQuery = `SELECT SUM(quantity) as total FROM transfers WHERE 1=1`;
      let tiParams = [];
      if (base) {
        transferInQuery += ` AND toBase = ?`;
        tiParams.push(base);
      }
      db.get(transferInQuery, tiParams, (err, tiRow) => {
        let transferOutQuery = `SELECT SUM(quantity) as total FROM transfers WHERE 1=1`;
        let toParams = [];
        if (base) {
          transferOutQuery += ` AND fromBase = ?`;
          toParams.push(base);
        }
        db.get(transferOutQuery, toParams, (err, toRow) => {
          let assignedQuery = `SELECT SUM(quantity) as total FROM assignments WHERE type = 'assigned'`;
          let aParams = [];
          if (base) {
            assignedQuery += ` AND base = ?`;
            aParams.push(base);
          }
          db.get(assignedQuery, aParams, (err, assignedRow) => {
            let expendedQuery = `SELECT SUM(quantity) as total FROM assignments WHERE type = 'expended'`;
            let eParams = [];
            if (base) {
              expendedQuery += ` AND base = ?`;
              eParams.push(base);
            }
            db.get(expendedQuery, eParams, (err, expendedRow) => {
              const openingBalance = assets.reduce((sum, a) => sum + a.openingBalance, 0);
              const purchasesTotal = purchaseRow.total || 0;
              const transfersInTotal = tiRow.total || 0;
              const transfersOutTotal = toRow.total || 0;
              const netMovement = purchasesTotal + transfersInTotal - transfersOutTotal;
              const assignedTotal = assignedRow.total || 0;
              const expendedTotal = expendedRow.total || 0;
              const closingBalance = openingBalance + netMovement - assignedTotal - expendedTotal;

              // For details, get lists
              db.all(`SELECT * FROM purchases WHERE base = ?`, [base], (err, purchases) => {
                db.all(`SELECT * FROM transfers WHERE toBase = ?`, [base], (err, transfersIn) => {
                  db.all(`SELECT * FROM transfers WHERE fromBase = ?`, [base], (err, transfersOut) => {
                    res.json({
                      openingBalance,
                      closingBalance,
                      netMovement,
                      assigned: assignedTotal,
                      expended: expendedTotal,
                      details: { purchases, transfersIn, transfersOut }
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

module.exports = { getDashboardData };
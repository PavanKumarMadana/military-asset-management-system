const express = require('express');
const { createPurchase, getPurchases } = require('../controllers/purchaseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['Admin', 'Logistics Officer']), createPurchase);
router.get('/', authMiddleware, getPurchases);

module.exports = router;
const express = require('express');
const { createTransfer, getTransfers } = require('../controllers/transferController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['Admin', 'Logistics Officer']), createTransfer);
router.get('/', authMiddleware, getTransfers);

module.exports = router;
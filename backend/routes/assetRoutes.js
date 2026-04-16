const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have this

router.get('/', authMiddleware, assetController.getAssets);

module.exports = router;
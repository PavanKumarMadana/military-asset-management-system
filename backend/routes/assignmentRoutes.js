const express = require('express');
const { createAssignment, getAssignments } = require('../controllers/assignmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware(['Admin', 'Base Commander']), createAssignment);
router.get('/', authMiddleware, getAssignments);

module.exports = router;
// backend/routes/assessmentRoutes.js
const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Only teachers can assign and update assessments
router.post('/assign', protect, authorizeRoles('teacher'), assessmentController.assignAssessment);
router.get('/teacher', protect, authorizeRoles('teacher'), assessmentController.getTeacherAssessments);
router.post('/update', protect, authorizeRoles('teacher'), assessmentController.updateAssessment);

// Students can view their assessments
router.get('/student', protect, authorizeRoles('student'), assessmentController.getStudentAssessments);
// Students can mark assessment as completed
router.post('/complete', protect, authorizeRoles('student'), assessmentController.completeAssessment);
// Students can update their own assessment status and score
router.post('/student/update', protect, authorizeRoles('student'), assessmentController.updateStudentAssessment);

module.exports = router;

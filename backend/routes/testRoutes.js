// backend/routes/testRoutes.js - For testing purposes only
const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const VideoDrill = require('../models/VideoDrill');
const { protect } = require('../middleware/authMiddleware');

// Create a test assessment for current user as student
router.post('/create-student-assessment', protect, async (req, res) => {
  try {
    // Find any teacher and use current user as student
    const teacher = await User.findOne({ role: 'teacher' });
    const student = req.user; // Current user must be student
    
    if (!teacher) {
      return res.status(400).json({ message: 'No teacher found in system' });
    }
    
    if (student.role !== 'student') {
      return res.status(400).json({ message: 'Current user must be a student' });
    }
    
    // Find a drill
    const drill = await VideoDrill.findOne();
    if (!drill) {
      return res.status(400).json({ message: 'No drill found in system' });
    }
    
    // Create assessment
    const assessment = new Assessment({
      teacher: teacher._id,
      student: student._id,
      drill: drill._id,
      score: 0,
      feedback: 'Test assessment for current student',
      status: 'incomplete'
    });
    
    await assessment.save();
    await assessment.populate('drill', 'title disasterType');
    
    res.json({
      message: 'Test assessment created for current student',
      assessment: {
        id: assessment._id,
        teacher: teacher.name,
        student: student.name,
        drill: assessment.drill.title || assessment.drill.disasterType,
        status: assessment.status
      },
      instructions: 'Now go to "My Assessments" page and start the drill from there'
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating assessment', error: err.message });
  }
});

// Get assessment status for debugging
router.get('/assessment-status/:id', protect, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('student', 'name')
      .populate('teacher', 'name')
      .populate('drill', 'title disasterType');
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    res.json({
      assessment,
      currentUser: {
        id: req.user._id,
        name: req.user.name,
        role: req.user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching assessment', error: err.message });
  }
});

// Test endpoint to manually update assessment status
router.post('/update-assessment-status/:id', protect, async (req, res) => {
  try {
    const { status, score } = req.body;
    console.log(`[TEST] User ${req.user.name} (${req.user.role}) updating assessment ${req.params.id} to status: ${status}, score: ${score}`);
    
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    console.log(`[TEST] Before update: status=${assessment.status}, score=${assessment.score}`);
    
    if (status) assessment.status = status;
    if (score !== undefined) assessment.score = score;
    
    if (status === 'completed' && !assessment.completedAt) {
      assessment.completedAt = new Date();
    }
    
    await assessment.save();
    
    console.log(`[TEST] After update: status=${assessment.status}, score=${assessment.score}`);
    
    await assessment.populate('student', 'name');
    await assessment.populate('teacher', 'name');
    await assessment.populate('drill', 'title disasterType');
    
    res.json({ 
      message: 'Assessment updated successfully',
      assessment 
    });
  } catch (err) {
    console.error('[TEST] Error updating assessment:', err.message);
    res.status(500).json({ message: 'Error updating assessment', error: err.message });
  }
});

module.exports = router;
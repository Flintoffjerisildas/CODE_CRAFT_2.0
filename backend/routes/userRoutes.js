const express = require('express');
const router = express.Router();
const User = require('../models/User');
const VideoDrill = require('../models/VideoDrill');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Get all students
router.get('/students', protect, authorizeRoles('teacher'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('_id name email region');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students', error: err.message });
  }
});

// Get all drills (for select dropdown)
router.get('/drills', protect, authorizeRoles('teacher'), async (req, res) => {
  try {
    // Return only _id and title for each drill (title from first lesson or disasterType)
    const drills = await VideoDrill.find().select('_id disasterType lessons');
    const formatted = drills.map(d => ({
      _id: d._id,
      title: d.lessons?.[0]?.title || d.disasterType || 'Untitled Drill'
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching drills', error: err.message });
  }
});

module.exports = router;
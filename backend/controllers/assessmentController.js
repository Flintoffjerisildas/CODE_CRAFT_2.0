// Student marks assessment as completed
exports.completeAssessment = async (req, res) => {
  try {
    const { assessmentId } = req.body;
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    // Only the assigned student can mark as completed
    if (assessment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    assessment.completedAt = new Date();
    await assessment.save();
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ message: 'Error completing assessment', error: err.message });
  }
};
// backend/controllers/assessmentController.js
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const VideoDrill = require('../models/VideoDrill');

// Teacher assigns assessment to one or all students for a drill
exports.assignAssessment = async (req, res) => {
  try {
    const { studentId, drillId, score, feedback, assignToAll } = req.body;
    const teacherId = req.user._id;
    if (assignToAll) {
      // Assign to all students
      const students = await User.find({ role: 'student' }).select('_id');
      const assessments = await Promise.all(students.map(async (student) => {
        const assessment = new Assessment({
          teacher: teacherId,
          student: student._id,
          drill: drillId,
          score: score || 0,
          feedback: feedback || '',
        });
        await assessment.save();
        return assessment;
      }));
      res.status(201).json({ message: 'Assessments assigned to all students', assessments });
    } else {
      // Assign to one student
      const assessment = new Assessment({
        teacher: teacherId,
        student: studentId,
        drill: drillId,
        score: score || 0,
        feedback: feedback || '',
      });
      await assessment.save();
      res.status(201).json(assessment);
    }
  } catch (err) {
    res.status(500).json({ message: 'Error assigning assessment', error: err.message });
  }
};

// Get all assessments assigned by the teacher
exports.getTeacherAssessments = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const assessments = await Assessment.find({ teacher: teacherId })
      .populate('student', 'name email')
      .populate('drill', 'title disasterType');
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching assessments', error: err.message });
  }
};

// Get all assessments for a student
exports.getStudentAssessments = async (req, res) => {
  try {
    const studentId = req.user._id;
    const assessments = await Assessment.find({ student: studentId })
      .populate('teacher', 'name email')
      .populate('drill', 'title disasterType');
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching assessments', error: err.message });
  }
};

// Update assessment score/feedback (teacher only)
exports.updateAssessment = async (req, res) => {
  try {
    const { assessmentId, score, feedback, status } = req.body;
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    
    // Check if teacher owns this assessment
    if (assessment.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this assessment' });
    }
    
    if (score !== undefined) assessment.score = score;
    if (feedback !== undefined) assessment.feedback = feedback;
    if (status !== undefined) assessment.status = status;
    
    // Set completedAt when status is changed to 'completed'
    if (status === 'completed' && !assessment.completedAt) {
      assessment.completedAt = new Date();
    } else if (status !== 'completed' && assessment.completedAt) {
      assessment.completedAt = null;
    }
    
    await assessment.save();
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ message: 'Error updating assessment', error: err.message });
  }
};

// Student updates their own assessment status and score after completing drill
exports.updateStudentAssessment = async (req, res) => {
  try {
    const { assessmentId, score, status } = req.body;
    console.log(`[DEBUG] Student ${req.user.name} updating assessment ${assessmentId}:`, { score, status });
    
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      console.log(`[DEBUG] Assessment ${assessmentId} not found`);
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    // Check if student owns this assessment
    if (assessment.student.toString() !== req.user._id.toString()) {
      console.log(`[DEBUG] Unauthorized: Student ${req.user._id} tried to update assessment owned by ${assessment.student}`);
      return res.status(403).json({ message: 'Not authorized to update this assessment' });
    }
    
    console.log(`[DEBUG] Before update: score=${assessment.score}, status=${assessment.status}`);
    
    // Students can only update score and status, not feedback
    if (score !== undefined) assessment.score = score;
    if (status !== undefined) assessment.status = status;
    
    // Set completedAt when status is changed to 'completed'
    if (status === 'completed' && !assessment.completedAt) {
      assessment.completedAt = new Date();
      console.log(`[DEBUG] Set completedAt timestamp`);
    }
    
    await assessment.save();
    console.log(`[DEBUG] After update: score=${assessment.score}, status=${assessment.status}`);
    
    res.json(assessment);
  } catch (err) {
    console.error(`[DEBUG] Error updating student assessment:`, err.message);
    res.status(500).json({ message: 'Error updating student assessment', error: err.message });
  }
};

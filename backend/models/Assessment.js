// backend/models/Assessment.js
const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  drill: { type: mongoose.Schema.Types.ObjectId, ref: 'VideoDrill', required: true },
  score: { type: Number, default: 0 },
  feedback: { type: String },
  assignedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  status: {
    type: String,
    enum: ['incomplete', 'working', 'completed'],
    default: 'incomplete',
    required: true
  },
});

// Add indexes for better performance with concurrent access
assessmentSchema.index({ student: 1, assignedAt: -1 }); // Student assessments sorted by date
assessmentSchema.index({ teacher: 1, assignedAt: -1 }); // Teacher assessments sorted by date
assessmentSchema.index({ status: 1 }); // Filter by status
assessmentSchema.index({ drill: 1 }); // Filter by drill

module.exports = mongoose.model('Assessment', assessmentSchema);

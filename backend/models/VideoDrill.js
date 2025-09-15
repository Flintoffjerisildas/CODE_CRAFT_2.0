const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
  responseVideoUrl: { type: String }, // Video shown after selecting this option
});

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  question: { type: String, required: true },
  options: [optionSchema],
  explanation: String,
});

const videoDrillSchema = new mongoose.Schema({
  disasterType: { type: String, required: true }, // e.g., "flood"
  lessons: [lessonSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("VideoDrill", videoDrillSchema);
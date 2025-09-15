const mongoose = require("mongoose");

const videoScenarioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  disasterType: { type: String, required: true }, // e.g., "flood", "fire"
  videoUrl: { type: String, required: true }, // URL or path to the video file
  questions: [
    {
      prompt: { type: String, required: true },
      options: [
        {
          text: { type: String, required: true },
          isCorrect: { type: Boolean, default: false }
        }
      ],
      explanation: String
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("VideoScenario", videoScenarioSchema);
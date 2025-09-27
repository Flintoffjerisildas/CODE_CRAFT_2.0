const mongoose = require("mongoose");

const scenarioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  disasterType: { type: String, enum: ["fire", "flood", "earthquake"], required: true },
  description: String,
  questions: [
    {
      timePoint: Number, // seconds in drill where question is asked
      questionText: String,
      options: [String],
      correctIndex: Number,
    },
  ],
});
// Scenario model removed. No longer used in the project.

const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  scenario: { type: mongoose.Schema.Types.ObjectId, ref: "Scenario" },
  points: { type: Number, default: 0 },
  attempts: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Score", scoreSchema);

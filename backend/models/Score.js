const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  videoDrill: { type: mongoose.Schema.Types.ObjectId, ref: "VideoDrill" }, // for video drill scores
  disasterType: { type: String }, // e.g., "flood", "earthquake"
  points: { type: Number, default: 0 },
  attempts: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Score", scoreSchema);

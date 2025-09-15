const Score = require("../models/Score");

// Save Score
const saveScore = async (req, res) => {
  try { console.log("Incoming Score:", req.body);  // Debug log
    const { scenario, points } = req.body;

    if (!scenario || points === undefined) {
      return res.status(400).json({ error: "scenario and points required" });
    }

    const score = new Score({
      user: req.user._id,
      scenario,
      points,
    });
    await score.save();
    res.json(score);
  } catch (err) {
    res.status(500).json({ error: "Failed to save score" });
  }
};

// Get my scores
const getMyScores = async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user._id }).populate("scenario", "title");
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch my scores" });
  }
};

// Get all scores (teacher/admin)
const getAllScores = async (req, res) => {
  try {
    const scores = await Score.find()
      .populate("user", "name email")
      .populate("scenario", "title");
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all scores" });
  }
};

// Leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const { scenario } = req.params;
    const leaderboard = await Score.find({ scenario })
      .populate("user", "name")
      .sort({ points: -1 })
      .limit(10);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};

module.exports = {
  saveScore,
  getMyScores,
  getAllScores,
  getLeaderboard,
};

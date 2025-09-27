// Global leaderboard (top scores across all drills)
const getGlobalLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Score.find()
      .populate("user", "name")
      .sort({ points: -1 })
      .limit(10);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch global leaderboard" });
  }
};
const Score = require("../models/Score");

// Save Score
const saveScore = async (req, res) => {
  try {
    console.log("Incoming Score:", req.body); // Debug log
    const { videoDrill, disasterType, points } = req.body;

    if (videoDrill && points !== undefined) {
      const score = new Score({
        user: req.user._id,
        videoDrill,
        disasterType: disasterType || undefined,
        points,
      });
      await score.save();
      return res.json(score);
    } else {
      return res.status(400).json({ error: "videoDrill and points required" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to save score" });
  }
};

// Get my scores
const getMyScores = async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user._id }).populate("videoDrill", "title");
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
      .populate("videoDrill", "title");
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all scores" });
  }
};

// Leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const { videoDrill } = req.params;
    const leaderboard = await Score.find({ videoDrill })
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
  getGlobalLeaderboard,
};

const express = require("express");
const {
  createVideoScenario,
  getAllVideoScenarios,
  getVideoScenarioById
} = require("../controllers/videoScenarioController");
const { protect } = require("../middleware/authMiddleware");
const VideoScenario = require("../models/VideoScenario"); // <-- Corrected import

const router = express.Router();

router.post("/", protect, createVideoScenario);
router.get("/", getAllVideoScenarios);
router.get("/:id", getVideoScenarioById);
router.get("/type/:disasterType", async (req, res) => {
  try {
    const scenarios = await VideoScenario.find({ disasterType: req.params.disasterType });
    res.json(scenarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
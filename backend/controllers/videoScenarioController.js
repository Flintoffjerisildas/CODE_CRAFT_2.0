const VideoScenario = require("../models/VideoScenario");

// Create a new video scenario
exports.createVideoScenario = async (req, res) => {
  try {
    const scenario = new VideoScenario(req.body);
    await scenario.save();
    res.status(201).json(scenario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all video scenarios
exports.getAllVideoScenarios = async (req, res) => {
  try {
    const scenarios = await VideoScenario.find();
    res.json(scenarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single video scenario by ID
exports.getVideoScenarioById = async (req, res) => {
  try {
    const scenario = await VideoScenario.findById(req.params.id);
    if (!scenario) return res.status(404).json({ error: "Not found" });
    res.json(scenario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
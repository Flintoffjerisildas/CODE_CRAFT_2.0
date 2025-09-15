const Scenario = require("../models/Scenario");

// Create new scenario
exports.createScenario = async (req, res) => {
  try {
    const scenario = await Scenario.create(req.body);
    res.status(201).json(scenario);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all scenarios
exports.getScenarios = async (req, res) => {
  try {
    const scenarios = await Scenario.find();
    res.json(scenarios);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get single scenario by ID
exports.getScenarioById = async (req, res) => {
  try {
    const scenario = await Scenario.findById(req.params.id);
    if (!scenario) return res.status(404).json({ msg: "Scenario not found" });
    res.json(scenario);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

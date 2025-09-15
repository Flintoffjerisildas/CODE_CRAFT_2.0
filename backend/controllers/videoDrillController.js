const VideoDrill = require("../models/VideoDrill");

exports.createVideoDrill = async (req, res) => {
  try {
    const drill = new VideoDrill(req.body);
    await drill.save();
    res.status(201).json(drill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllVideoDrills = async (req, res) => {
  try {
    const drills = await VideoDrill.find();
    res.json(drills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVideoDrillById = async (req, res) => {
  try {
    const drill = await VideoDrill.findById(req.params.id);
    if (!drill) return res.status(404).json({ error: "Not found" });
    res.json(drill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDrillsByDisasterType = async (req, res) => {
  try {
    const drills = await VideoDrill.find({ disasterType: req.params.disasterType });
    res.json(drills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
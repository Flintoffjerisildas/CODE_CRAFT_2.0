const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { createScenario, getScenarios, getScenarioById } = require("../controllers/scenarioController");

const router = express.Router();

// Only teacher/admin can create scenarios
router.post("/", protect, authorizeRoles("teacher", "admin"), createScenario);

// Anyone can view scenarios
router.get("/", getScenarios);
router.get("/:id", getScenarioById);

module.exports = router;

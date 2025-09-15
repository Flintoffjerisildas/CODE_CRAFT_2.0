const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { saveScore, getMyScores, getAllScores, getLeaderboard } = require("../controllers/scoreController");

const router = express.Router();

router.post("/", protect, saveScore);
router.get("/", protect, getMyScores);
router.get("/all", protect, authorizeRoles("teacher", "admin"), getAllScores);
router.get("/leaderboard/:scenarioId", getLeaderboard);

module.exports = router;

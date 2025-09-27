const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const { saveScore, getMyScores, getAllScores, getLeaderboard, getGlobalLeaderboard } = require("../controllers/scoreController");

const router = express.Router();

router.get("/leaderboard", getGlobalLeaderboard);
router.post("/", protect, saveScore);
router.get("/", protect, getMyScores);
router.get("/all", protect, authorizeRoles("teacher", "admin"), getAllScores);
router.get("/leaderboard/:videoDrill", getLeaderboard);

module.exports = router;

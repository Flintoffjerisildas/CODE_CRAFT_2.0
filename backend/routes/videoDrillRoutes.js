const express = require("express");
const {
  createVideoDrill,
  getAllVideoDrills,
  getVideoDrillById,
  getDrillsByDisasterType
} = require("../controllers/videoDrillController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createVideoDrill);
router.get("/", getAllVideoDrills);
router.get("/:id", getVideoDrillById);
router.get("/type/:disasterType", getDrillsByDisasterType);

module.exports = router;
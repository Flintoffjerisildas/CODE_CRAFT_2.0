const express = require("express");
const { registerUser, loginUser, updateRegionLanguage } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/region-language", protect, updateRegionLanguage);

module.exports = router;

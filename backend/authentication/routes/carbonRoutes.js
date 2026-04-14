const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMyCarbonCredits } = require("../controllers/carbonController");

router.get("/me", protect, getMyCarbonCredits);

module.exports = router;

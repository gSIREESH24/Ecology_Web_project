const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getDrivingRoute } = require("../controllers/routingController");

router.post("/drive", protect, getDrivingRoute);

module.exports = router;

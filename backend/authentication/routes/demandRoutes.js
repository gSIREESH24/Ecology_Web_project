const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createDemand,
  getAllDemands,
  getMyDemands,
  acceptDemand,
  closeDemand,
} = require("../controllers/demandController");

router.post("/", protect, createDemand);
router.get("/", protect, getAllDemands);
router.get("/my", protect, getMyDemands);
router.patch("/:id/accept", protect, acceptDemand);
router.patch("/:id/close", protect, closeDemand);

module.exports = router;

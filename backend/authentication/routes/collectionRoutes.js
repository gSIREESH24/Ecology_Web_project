const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  createRequest,
  getAllRequests,
  getMyRequests,
  acceptRequest,
  markCollected,
} = require("../controllers/collectionController");

router.post("/", protect, authorizeRoles("farmer"), upload.single("cropPhoto"), createRequest);
router.get("/", protect, getAllRequests);
router.get("/my", protect, authorizeRoles("farmer"), getMyRequests);
router.patch("/:id/accept", protect, authorizeRoles("aggregator"), acceptRequest);
router.patch("/:id/collect", protect, authorizeRoles("aggregator"), markCollected);

module.exports = router;

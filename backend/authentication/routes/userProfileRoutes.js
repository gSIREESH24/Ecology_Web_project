const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  updateLocation,
  clearNotifications,
} = require("../controllers/userProfileController");

router.get("/profile", protect, getProfile);
router.patch("/profile", protect, updateProfile);
router.post("/profile/photo", protect, upload.single("profilePhoto"), uploadProfilePhoto);
router.patch("/location", protect, updateLocation);
router.patch("/notifications/clear", protect, clearNotifications);

module.exports = router;

const express = require("express");
const router = express.Router();

const {
  register,
  login,
  completeProfile,
  me,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.patch("/complete-profile", protect, completeProfile);
router.get("/me", protect, me);

module.exports = router;
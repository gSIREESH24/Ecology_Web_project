const User = require("../models/userSchema");
const path = require("path");
const fs = require("fs");

// GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PATCH /api/users/profile — Update profile info
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const allowedFields = ["name", "location"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field].trim();
      }
    });

    // Update role-specific profile fields
    const profileFields = req.body.profile || {};
    user.profile = { ...user.profile, ...profileFields };

    // Update GPS coordinates if provided
    if (req.body.lat && req.body.lng) {
      user.coordinates = { lat: Number(req.body.lat), lng: Number(req.body.lng) };
    }

    // Update land coordinates (polygon)
    if (req.body.landCoordinates) {
      user.landCoordinates = req.body.landCoordinates;
    }

    await user.save();
    const updatedUser = user.toObject();
    delete updatedUser.password;

    // Update localStorage-equivalent: return updated user
    return res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/users/profile/photo — Upload profile photo
const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete old photo if exists
    if (user.profilePhotoUrl) {
      const oldPath = path.join(__dirname, "../../", user.profilePhotoUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    user.profilePhotoUrl = `/uploads/${req.file.filename}`;
    await user.save();

    return res.json({ message: "Profile photo updated", photoUrl: user.profilePhotoUrl });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PATCH /api/users/location — Update GPS coordinates
const updateLocation = async (req, res) => {
  try {
    const { lat, lng, address } = req.body;
    if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng required" });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.coordinates = { lat: Number(lat), lng: Number(lng) };
    if (address) user.location = address;
    await user.save();

    return res.json({ message: "Location updated", coordinates: user.coordinates });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PATCH /api/users/notifications/clear — Clear notification badge
const clearNotifications = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { notificationCount: 0 });
    return res.json({ message: "Notifications cleared" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getProfile, updateProfile, uploadProfilePhoto, updateLocation, clearNotifications };

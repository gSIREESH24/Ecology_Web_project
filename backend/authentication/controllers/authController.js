const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const normalizeRole = (role) => (role || "").trim().toLowerCase();

const profileRequiredFields = {
  farmer: ["location", "pincode", "landSize"],
  aggregator: ["operatingArea", "pincode", "storageCapacity", "vehicleType", "experience"],
  industry: ["companyName", "industryType", "location", "pincode"],
};

const validateProfileByRole = (role, profile) => {
  const errors = [];
  const fields = profileRequiredFields[role] || [];

  for (const field of fields) {
    if (profile[field] === undefined || profile[field] === null || String(profile[field]).trim() === "") {
      errors.push(field);
    }
  }

  return errors;
};

// REGISTER
const register = async (req, res) => {
  try {
    let { name, mobile, location, password, role } = req.body;
    role = normalizeRole(role);

    if (!name || !mobile || !location || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!/^[0-9]{10}$/.test(mobile.trim())) {
      return res.status(400).json({ message: "Enter a valid 10-digit mobile number" });
    }

    if (!["farmer", "aggregator", "industry"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const exists = await User.findOne({ mobile: mobile.trim() });
    if (exists) {
      return res.status(400).json({ message: "Mobile number already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      mobile: mobile.trim(),
      location: location.trim(),
      password: hashedPassword,
      role,
      profileComplete: false,
      profile: {},
    });

    return res.status(201).json({
      message: "Registered successfully",
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        location: user.location,
        role: user.role,
        profileComplete: user.profileComplete,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    let { mobile, password, role } = req.body;
    role = normalizeRole(role);

    if (!mobile || !password || !role) {
      return res.status(400).json({ message: "Mobile, password and role are required" });
    }

    const user = await User.findOne({ mobile: mobile.trim() });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: "Role mismatch" });
    }

    return res.status(200).json({
      message: "Login successful",
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        location: user.location,
        role: user.role,
        profileComplete: user.profileComplete,
        profile: user.profile,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// COMPLETE PROFILE
const completeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const role = user.role;
    const body = req.body;

    const errors = validateProfileByRole(role, body);
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Missing required profile fields",
        missingFields: errors,
      });
    }

    const updatedProfile = { ...user.profile };

    if (role === "farmer") {
      updatedProfile.location = body.location?.trim();
      updatedProfile.pincode = body.pincode?.trim();
      updatedProfile.landSize = Number(body.landSize);
    }

    if (role === "aggregator") {
      updatedProfile.operatingArea = body.operatingArea?.trim();
      updatedProfile.pincode = body.pincode?.trim();
      updatedProfile.storageCapacity = Number(body.storageCapacity);
      updatedProfile.vehicleType = body.vehicleType?.trim();
      updatedProfile.experience = body.experience?.trim();
    }

    if (role === "industry") {
      updatedProfile.companyName = body.companyName?.trim();
      updatedProfile.industryType = body.industryType?.trim();
      updatedProfile.location = body.location?.trim();
      updatedProfile.pincode = body.pincode?.trim();
    }

    user.profile = updatedProfile;
    user.profileComplete = true;

    await user.save();

    return res.status(200).json({
      message: "Profile completed successfully",
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        location: user.location,
        role: user.role,
        profileComplete: user.profileComplete,
        profile: user.profile,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// CURRENT USER
const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  completeProfile,
  me,
};
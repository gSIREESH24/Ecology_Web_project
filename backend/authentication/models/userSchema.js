const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[0-9]{10}$/,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      required: true,
      enum: ["farmer", "aggregator", "industry"],
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
    profile: {
      location: { type: String },
      pincode: { type: String },

      landSize: { type: Number }, // farmer

      operatingArea: { type: String }, // aggregator
      storageCapacity: { type: Number }, // aggregator
      vehicleType: { type: String }, // aggregator
      experience: {
        type: String,
        enum: ["0-1 years", "1-3 years", "3-5 years", "5+ years"],
      },

      companyName: { type: String }, // industry
      industryType: { type: String }, // industry
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);